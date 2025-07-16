from manim import (
    Scene, Text, VGroup, Dot, Line, Arrow, Rectangle, Circle,
    FadeIn, FadeOut, Write, Transform, Create, AnimationGroup,
    RIGHT, LEFT, UP, DOWN, ORIGIN, UL, UR, DL, DR,
    BLUE, RED, GREEN, YELLOW, ORANGE, WHITE, PURPLE, PINK,
    ValueTracker, always_redraw, Indicate, Flash,
    LaggedStart, Wait, Succession, MathTex, Tex
)
import numpy as np
import math

class NetworkArchitectureIntro(Scene):
    def construct(self):
        # Title sequence
        title = Text("Neural Network Architecture", font_size=72, color=BLUE)
        subtitle = Text("Understanding the Building Blocks of AI", font_size=36, color=WHITE)
        subtitle.next_to(title, DOWN, buff=0.5)
        
        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))
        
        # Part 1: What is a Neural Network?
        section1 = Text("What is a Neural Network?", font_size=48, color=BLUE)
        section1.to_edge(UP)
        
        self.play(Write(section1))
        self.wait(1.5)
        
        # Show brain analogy
        brain_text = Text("Inspired by the Human Brain", font_size=36, color=WHITE)
        brain_text.to_edge(DOWN)
        
        self.play(Write(brain_text))
        
        # Create simplified neuron
        neuron_circle = Circle(radius=0.5, color=YELLOW, fill_opacity=0.3)
        neuron_circle.move_to(ORIGIN)
        
        # Input dendrites
        dendrites = VGroup()
        for i in range(3):
            angle = math.pi + i * math.pi / 6
            start = neuron_circle.get_center() + 0.5 * np.array([math.cos(angle), math.sin(angle), 0])
            end = start + 1.5 * np.array([math.cos(angle), math.sin(angle), 0])
            dendrite = Line(start, end, color=GREEN)
            dendrites.add(dendrite)
        
        # Output axon
        axon = Arrow(
            neuron_circle.get_center() + 0.5 * RIGHT,
            neuron_circle.get_center() + 2 * RIGHT,
            color=RED,
            buff=0
        )
        
        neuron_label = Text("Neuron", font_size=24, color=YELLOW)
        neuron_label.to_corner(UL)
        
        input_label = Text("Inputs", font_size=20, color=GREEN)
        input_label.to_corner(DL)
        
        output_label = Text("Output", font_size=20, color=RED)
        output_label.to_corner(DR)
        
        self.play(Create(neuron_circle))
        self.play(Create(dendrites))
        self.play(Create(axon))
        self.play(Write(neuron_label), Write(input_label), Write(output_label))
        self.wait(2)
        
        # Transition to artificial neural network
        transition_text = Text("Artificial Neural Networks use this idea!", font_size=32, color=ORANGE)
        transition_text.to_edge(DOWN)
        
        self.play(Transform(brain_text, transition_text))
        self.wait(1)
        self.play(FadeOut(section1, brain_text, neuron_circle, dendrites, axon, neuron_label, input_label, output_label))
        
        # Part 2: Network Architecture
        section2 = Text("Network Architecture", font_size=48, color=GREEN)
        section2.to_edge(UP)
        
        self.play(Write(section2))
        self.wait(1.5)
        
        # Create a simple 3-layer network
        network_title = Text("A Simple Neural Network", font_size=36, color=WHITE)
        network_title.to_edge(DOWN)
        self.play(Write(network_title))
        
        # Define layer positions
        input_x = -4
        hidden_x = 0
        output_x = 4
        
        # Input layer (3 neurons)
        input_neurons = VGroup()
        input_values = [0.8, 0.3, 0.9]
        for i in range(3):
            y = 1.5 - i * 1.5
            neuron = Circle(radius=0.3, color=BLUE, fill_opacity=0.7)
            neuron.move_to(np.array([input_x, y, 0]))
            
            # Add value label
            value_label = Text(f"{input_values[i]:.1f}", font_size=18, color=WHITE)
            value_label.move_to(neuron.get_center())
            
            input_neurons.add(VGroup(neuron, value_label))
        
        # Hidden layer (4 neurons)
        hidden_neurons = VGroup()
        for i in range(4):
            y = 2 - i * 1.0
            neuron = Circle(radius=0.3, color=GREEN, fill_opacity=0.7)
            neuron.move_to(np.array([hidden_x, y, 0]))
            hidden_neurons.add(neuron)
        
        # Output layer (2 neurons)
        output_neurons = VGroup()
        output_labels = ["Cat", "Dog"]
        for i in range(2):
            y = 0.5 - i * 1.0
            neuron = Circle(radius=0.3, color=RED, fill_opacity=0.7)
            neuron.move_to(np.array([output_x, y, 0]))
            
            # Add label
            label = Text(output_labels[i], font_size=16, color=WHITE)
            label.next_to(neuron, RIGHT, buff=0.1)
            
            output_neurons.add(VGroup(neuron, label))
        
        # Create connections
        connections = VGroup()
        
        # Input to hidden connections
        for i in range(3):
            for j in range(4):
                input_pos = input_neurons[i][0].get_center()
                hidden_pos = hidden_neurons[j].get_center()
                
                # Vary line thickness based on weight
                weight = np.random.uniform(0.1, 1.0)
                line = Line(input_pos, hidden_pos, color=YELLOW, stroke_width=weight*3)
                connections.add(line)
        
        # Hidden to output connections
        for i in range(4):
            for j in range(2):
                hidden_pos = hidden_neurons[i].get_center()
                output_pos = output_neurons[j][0].get_center()
                
                weight = np.random.uniform(0.1, 1.0)
                line = Line(hidden_pos, output_pos, color=YELLOW, stroke_width=weight*3)
                connections.add(line)
        
        # Layer labels
        input_label = Text("Input Layer", font_size=24, color=BLUE)
        input_label.to_corner(UL)
        
        hidden_label = Text("Hidden Layer", font_size=24, color=GREEN)
        hidden_label.to_corner(UR)
        
        output_label = Text("Output Layer", font_size=24, color=RED)
        output_label.to_corner(DR)
        
        # Animate network creation
        self.play(Create(connections))
        self.play(Create(input_neurons))
        self.play(Create(hidden_neurons))
        self.play(Create(output_neurons))
        self.play(Write(input_label), Write(hidden_label), Write(output_label))
        
        self.wait(2)
        
        # Part 3: Forward Pass
        self.play(FadeOut(section2, network_title))
        forward_text = Text("Forward Pass: How Data Flows", font_size=32, color=ORANGE)
        forward_text.to_edge(UP)
        self.play(Write(forward_text))
        
        # Animate data flow with color changes instead of flashes
        original_colors = []
        for i in range(3):
            original_colors.append(input_neurons[i][0].color)
            self.play(input_neurons[i][0].animate.set_color(PINK), run_time=0.5)
        
        self.wait(0.5)
        
        # Activate hidden layer with color changes
        hidden_original_colors = []
        for i in range(4):
            hidden_original_colors.append(hidden_neurons[i].color)
            self.play(hidden_neurons[i].animate.set_color(ORANGE), run_time=0.3)
        
        self.wait(0.5)
        
        # Activate output layer with color changes
        output_original_colors = []
        for i in range(2):
            output_original_colors.append(output_neurons[i][0].color)
            self.play(output_neurons[i][0].animate.set_color(PURPLE), run_time=0.3)
        
        self.wait(1)
        
        # Reset colors
        for i in range(3):
            self.play(input_neurons[i][0].animate.set_color(original_colors[i]), run_time=0.3)
        for i in range(4):
            self.play(hidden_neurons[i].animate.set_color(hidden_original_colors[i]), run_time=0.3)
        for i in range(2):
            self.play(output_neurons[i][0].animate.set_color(output_original_colors[i]), run_time=0.3)
        
        # Part 4: Training Process
        self.play(FadeOut(forward_text))
        training_text = Text("How Neural Networks Learn", font_size=32, color=PURPLE)
        training_text.to_edge(UP)
        self.play(Write(training_text))
        
        # Show error calculation
        error_text = Text("1. Calculate Error", font_size=24, color=WHITE)
        error_text.to_edge(DOWN)
        self.play(Write(error_text))
        
        # Highlight output neurons with color change
        for i in range(2):
            self.play(output_neurons[i][0].animate.set_color(PINK), run_time=0.5)
        
        self.wait(1)
        
        # Show backpropagation
        backprop_text = Text("2. Backpropagation", font_size=24, color=WHITE)
        backprop_text.to_edge(DOWN)
        self.play(Transform(error_text, backprop_text))
        
        # Animate backward flow with color changes
        for i in range(2):
            self.play(output_neurons[i][0].animate.set_color(ORANGE), run_time=0.3)
        
        for i in range(4):
            self.play(hidden_neurons[i].animate.set_color(ORANGE), run_time=0.3)
        
        for i in range(3):
            self.play(input_neurons[i][0].animate.set_color(ORANGE), run_time=0.3)
        
        self.wait(1)
        
        # Show weight updates
        update_text = Text("3. Update Weights", font_size=24, color=WHITE)
        update_text.to_edge(DOWN)
        self.play(Transform(error_text, update_text))
        
        # Animate weight changes with color changes
        for line in connections:
            self.play(line.animate.set_color(PINK), run_time=0.1)
        
        # Reset connection colors
        for line in connections:
            self.play(line.animate.set_color(YELLOW), run_time=0.1)
        
        self.wait(2)
        
        # Clean up for summary - fade out everything except key elements
        self.play(FadeOut(training_text, error_text, input_label, hidden_label, output_label))
        self.play(FadeOut(connections, input_neurons, hidden_neurons, output_neurons))
        # need to fade out all the neurons and connections
        self.play(FadeOut(input_neurons, hidden_neurons, output_neurons))
        self.play(FadeOut(connections))
        
        # Final summary - important text in center, everything else faded out
        summary_title = Text("Key Takeaways", font_size=48, color=YELLOW)
        summary_title.to_edge(UP)
        
        takeaways = VGroup(
            Text("• Neural networks are layers of interconnected neurons", font_size=28, color=WHITE),
            Text("• Data flows forward through the network to make predictions", font_size=28, color=WHITE),
            Text("• Networks learn by adjusting connection weights", font_size=28, color=WHITE),
            Text("• Training uses backpropagation to minimize errors", font_size=28, color=WHITE)
        ).arrange(DOWN, buff=0.5, aligned_edge=LEFT)
        takeaways.move_to(ORIGIN)
        
        self.play(Write(summary_title))
        self.play(LaggedStart(*[Write(takeaway) for takeaway in takeaways], lag_ratio=0.8))
        self.wait(3)
        
        # Ending message
        ending = Text("Ready to explore neural networks? ✨", font_size=36, color=BLUE)
        ending.to_edge(DOWN)
        
        self.play(Write(ending))
        self.wait(2)
        
        # Fade out everything
        self.play(FadeOut(*self.mobjects))
        self.wait(1) 