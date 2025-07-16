#!/usr/bin/env python3
"""
Asset generation script for the Machine Learning Education Platform
Generates Manim animations and copies them to the React app's public folder
"""

import argparse
import shutil
import subprocess
import json
from datetime import datetime
from pathlib import Path

# Configuration
SCENES_DIR = Path("scenes")
OUTPUT_DIR = Path("generated")
REACT_PUBLIC_DIR = Path("../apps/org/public/visuals")

# Scene configurations
SCENES_CONFIG = {
    "linear_regression": {
        "gradient_descent.py": ["GradientDescentIntro", "LinearRegressionVisualization"],
        "quick_explanation.py": ["LinearRegression30Second", "LinearRegressionStory"],
    },
    "classification": {
        "svm_visualization.py": ["SVMIntroduction", "KernelTrick"],
    },
    "neural_network": {
        "backpropagation.py": ["BackpropagationViz", "NeuralNetworkTraining"],
        "text_encoder.py": ["TextEncoderExplained"],
        "network_architecture.py": ["NetworkArchitectureIntro"],
        "training_process.py": ["TrainingProcessDetail"],
    },
}

def setup_directories():
    """Create necessary directories"""
    OUTPUT_DIR.mkdir(exist_ok=True)
    REACT_PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    
    for topic in SCENES_CONFIG.keys():
        (OUTPUT_DIR / topic).mkdir(exist_ok=True)
        (REACT_PUBLIC_DIR / topic).mkdir(exist_ok=True)

def generate_scene(topic, filename, scene_name):
    """Generate a single Manim scene"""
    scene_path = SCENES_DIR / topic / filename
    output_path = OUTPUT_DIR / topic
    
    if not scene_path.exists():
        print(f"⚠️  Scene file not found: {scene_path}")
        return False
    
    try:
        # Generate MP4 video
        print(f"🎬 Generating {scene_name} from {topic}/{filename}")
        result = subprocess.run([
            "manim", 
            "-ql",  # Low quality for faster generation
            "--output_file", f"{scene_name}.mp4",
            str(scene_path),
            scene_name
        ], capture_output=True, text=True, cwd=output_path.parent)
        
        if result.returncode != 0:
            print(f"❌ Error generating {scene_name}:")
            print(result.stderr)
            return False
        
        # Move generated file to proper location
        generated_file = output_path.parent / "media" / "videos" / topic / filename.replace(".py", "") / "480p15" / f"{scene_name}.mp4"
        target_file = output_path / f"{scene_name}.mp4"
        
        if generated_file.exists():
            shutil.move(str(generated_file), str(target_file))
            print(f"✅ Generated: {target_file}")
            return True
        else:
            print(f"❌ Could not find generated file: {generated_file}")
            return False
            
    except Exception as e:
        print(f"❌ Exception generating {scene_name}: {e}")
        return False

def copy_to_react():
    """Copy generated assets to React public folder"""
    if not REACT_PUBLIC_DIR.parent.exists():
        print(f"⚠️  React public directory not found: {REACT_PUBLIC_DIR.parent}")
        print("Skipping React copy (development mode)")
        return
    
    print(f"📁 Copying assets to React app...")
    
    for topic_dir in OUTPUT_DIR.iterdir():
        if topic_dir.is_dir():
            react_topic_dir = REACT_PUBLIC_DIR / topic_dir.name
            react_topic_dir.mkdir(parents=True, exist_ok=True)
            
            for asset_file in topic_dir.glob("*.mp4"):
                target_file = react_topic_dir / asset_file.name
                shutil.copy2(asset_file, target_file)
                print(f"📄 Copied: {asset_file.name}")

def generate_manifest():
    """Generate a manifest file for the React app"""
    manifest = {
        "generated_at": str(datetime.now()),
        "assets": {}
    }
    
    for topic in SCENES_CONFIG.keys():
        topic_dir = REACT_PUBLIC_DIR / topic
        if topic_dir.exists():
            manifest["assets"][topic] = [
                f.name for f in topic_dir.glob("*.mp4")
            ]
    
    manifest_path = REACT_PUBLIC_DIR / "manifest.json"
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    
    print(f"📄 Generated manifest: {manifest_path}")

def list_available_scenes():
    """List all available scenes"""
    print("📋 Available scenes:")
    for topic, files in SCENES_CONFIG.items():
        print(f"\n📚 {topic}:")
        for filename, scenes in files.items():
            print(f"  📄 {filename}:")
            for scene in scenes:
                print(f"    🎬 {scene}")

def filter_scenes_to_generate(args):
    """Filter scenes based on command line arguments"""
    scenes_to_generate = {}
    
    if args.list:
        list_available_scenes()
        return None
    
    # If no filters specified, generate everything
    if not args.topic and not args.file and not args.scene:
        return SCENES_CONFIG
    
    # Filter by topic
    topics_to_process = [args.topic] if args.topic else SCENES_CONFIG.keys()
    
    for topic in topics_to_process:
        if topic not in SCENES_CONFIG:
            print(f"❌ Unknown topic: {topic}")
            continue
            
        topic_scenes = {}
        files_in_topic = SCENES_CONFIG[topic]
        
        # Filter by file
        if args.file:
            if args.file in files_in_topic:
                files_to_process = {args.file: files_in_topic[args.file]}
            else:
                print(f"❌ File {args.file} not found in topic {topic}")
                continue
        else:
            files_to_process = files_in_topic
        
        # Filter by scene
        for filename, scenes in files_to_process.items():
            if args.scene:
                if args.scene in scenes:
                    topic_scenes[filename] = [args.scene]
                else:
                    print(f"❌ Scene {args.scene} not found in {topic}/{filename}")
            else:
                topic_scenes[filename] = scenes
        
        if topic_scenes:
            scenes_to_generate[topic] = topic_scenes
    
    return scenes_to_generate

def main():
    """Main generation process"""
    parser = argparse.ArgumentParser(description="Generate Manim video assets")
    parser.add_argument("--topic", "-t", help="Generate only scenes from specific topic (e.g., neural_network)")
    parser.add_argument("--file", "-f", help="Generate only scenes from specific file (e.g., text_encoder.py)")
    parser.add_argument("--scene", "-s", help="Generate only specific scene (e.g., TextEncoderExplained)")
    parser.add_argument("--list", "-l", action="store_true", help="List all available scenes")
    
    args = parser.parse_args()
    
    scenes_to_generate = filter_scenes_to_generate(args)
    
    if scenes_to_generate is None:  # --list was used
        return
    
    if not scenes_to_generate:
        print("❌ No scenes found matching the criteria")
        return
    
    print("🚀 Starting Manim asset generation...")
    
    setup_directories()
    
    total_scenes = sum(len(scenes) for files in scenes_to_generate.values() for scenes in files.values())
    generated_scenes = 0
    
    for topic, files in scenes_to_generate.items():
        print(f"\n📚 Processing {topic}...")
        
        for filename, scenes in files.items():
            for scene_name in scenes:
                if generate_scene(topic, filename, scene_name):
                    generated_scenes += 1
    
    print(f"\n🎯 Generated {generated_scenes}/{total_scenes} scenes")
    
    copy_to_react()
    
    print("\n✨ Asset generation complete!")
    print(f"📁 React assets: {REACT_PUBLIC_DIR}")
    print(f"🎬 Generated videos: {OUTPUT_DIR}")

if __name__ == "__main__":
    main() 