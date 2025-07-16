#!/usr/bin/env python3
"""
Setup script for Manim integration with the Machine Learning Education Platform
"""

import os
import subprocess
import sys
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def install_dependencies():
    """Install required Python packages"""
    print("📦 Installing dependencies...")
    
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True, text=True)
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        print("Error output:", e.stderr)
        sys.exit(1)

def create_directory_structure():
    """Create necessary directories"""
    directories = [
        Path("scenes/linear_regression"),
        Path("scenes/classification"),
        Path("scenes/neural_network"),
        Path("generated"),
        Path("../apps/org/public/visuals"),
    ]
    
    for directory in directories:
        directory.mkdir(parents=True, exist_ok=True)
        print(f"📁 Created directory: {directory}")

def test_manim_installation():
    """Test if Manim is working correctly"""
    print("🧪 Testing Manim installation...")
    
    # Create a simple test scene
    test_scene = '''
from manim import *

class TestScene(Scene):
    def construct(self):
        text = Text("Manim is working!")
        self.play(Write(text))
        self.wait(2)
'''
    
    # Write test scene to file
    test_file = Path("test_scene.py")
    with open(test_file, "w") as f:
        f.write(test_scene)
    
    try:
        # Try to generate the test scene
        result = subprocess.run([
            "manim", "-ql", "--preview", str(test_file), "TestScene"
        ], capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            print("✅ Manim installation test passed")
        else:
            print(f"❌ Manim test failed: {result.stderr}")
    except subprocess.TimeoutExpired:
        print("⏱️ Manim test timed out (this might be normal)")
    except Exception as e:
        print(f"❌ Manim test error: {e}")
    finally:
        # Clean up test file
        if test_file.exists():
            test_file.unlink()

def update_gitignore():
    """Update .gitignore to exclude Manim output"""
    gitignore_content = '''
# Manim generated files
manim-visuals/generated/
manim-visuals/media/
manim-visuals/__pycache__/
manim-visuals/*.log
manim-visuals/test_scene.py
'''
    
    root_gitignore = Path("../.gitignore")
    
    try:
        with open(root_gitignore, "a") as f:
            f.write(gitignore_content)
        print("✅ Updated .gitignore")
    except Exception as e:
        print(f"⚠️  Could not update .gitignore: {e}")

def main():
    print("🚀 Setting up Manim integration...")
    print("=" * 50)
    
    check_python_version()
    create_directory_structure()
    install_dependencies()
    test_manim_installation()
    update_gitignore()
    
    print("\n" + "=" * 50)
    print("✨ Setup complete!")
    print("\n📋 Next steps:")
    print("1. Run: python generate_assets.py")
    print("2. Add ManimalVideo components to your React lessons")
    print("3. Create more Manim scenes in the scenes/ directory")
    print("\n🎬 Example usage:")
    print("  <ManimalVideo")
    print("    topic='linear_regression'")
    print("    sceneName='GradientDescentIntro'")
    print("    title='How Gradient Descent Works'")
    print("  />")

if __name__ == "__main__":
    main() 