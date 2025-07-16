from manim import (
    Scene, Text, VGroup, Dot, Line, Arrow, Rectangle, Circle, MathTex,
    FadeIn, FadeOut, Write, Transform, Create, AnimationGroup,
    RIGHT, LEFT, UP, DOWN, ORIGIN, UL, UR, DL, DR,
    BLUE, RED, GREEN, YELLOW, ORANGE, WHITE, PURPLE, PINK,
    ValueTracker, always_redraw, Indicate, Flash,
    LaggedStart, Wait, Succession, NumberPlane, Axes
)
import numpy as np
import math

class TrainingProcessDetail(Scene):
    def construct(self):
        # Title sequence
        title = Text("Neural Network Training Process", font_size=64, color=BLUE)
        subtitle = Text("Mathematical Deep Dive", font_size=32, color=WHITE)
        subtitle.next_to(title, DOWN, buff=0.5)
        
        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))
        
        # Part 1: Forward Pass with Real Math
        section1 = Text("Part 1: Forward Pass", font_size=48, color=GREEN)
        section1.to_edge(UP)
        
        self.play(Write(section1))
        self.wait(1.5)
        
        # Create a simple 2-layer network with specific values
        network_title = Text("Forward Pass: Step by Step", font_size=32, color=WHITE)
        network_title.to_edge(DOWN)
        self.play(Write(network_title))
        
        # Define positions
        input_x = -4
        hidden_x = 0
        output_x = 4
        
        # Create input layer (2 neurons)
        input_neurons = VGroup()
        input_values = [0.8, 0.6]
        for i in range(2):
            y = 0.5 - i * 1.0
            neuron = Circle(radius=0.3, color=BLUE, fill_opacity=0.7)
            neuron.move_to(np.array([input_x, y, 0]))
            
            value_label = Text(f"{input_values[i]:.1f}", font_size=20, color=WHITE)
            value_label.move_to(neuron.get_center())
            
            input_neurons.add(VGroup(neuron, value_label))
        
        # Create hidden layer (3 neurons)
        hidden_neurons = VGroup()
        for i in range(3):
            y = 1.0 - i * 1.0
            neuron = Circle(radius=0.3, color=GREEN, fill_opacity=0.7)
            neuron.move_to(np.array([hidden_x, y, 0]))
            hidden_neurons.add(neuron)
        
        # Create output layer (1 neuron)
        output_neuron = Circle(radius=0.3, color=RED, fill_opacity=0.7)
        output_neuron.move_to(np.array([output_x, 0, 0]))
        
        # Define weights (mathematically accurate)
        weights_ih = np.array([
            [0.5, 0.3, 0.2],  # weights from input 1 to hidden neurons
            [0.4, 0.7, 0.1]   # weights from input 2 to hidden neurons
        ])
        
        weights_ho = np.array([0.6, 0.3, 0.8])  # weights from hidden to output
        
        # Create connections with weight labels
        connections = VGroup()
        weight_labels = VGroup()
        
        # Input to hidden connections
        for i in range(2):
            for j in range(3):
                input_pos = input_neurons[i][0].get_center()
                hidden_pos = hidden_neurons[j].get_center()
                
                weight = weights_ih[i][j]
                line = Line(input_pos, hidden_pos, color=YELLOW, stroke_width=weight*5)
                connections.add(line)
                
                # Add weight label
                mid_point = (input_pos + hidden_pos) / 2
                weight_label = Text(f"{weight:.1f}", font_size=12, color=YELLOW)
                weight_label.move_to(mid_point + 0.2 * UP)
                weight_labels.add(weight_label)
        
        # Hidden to output connections
        for i in range(3):
            hidden_pos = hidden_neurons[i].get_center()
            output_pos = output_neuron.get_center()
            
            weight = weights_ho[i]
            line = Line(hidden_pos, output_pos, color=YELLOW, stroke_width=weight*5)
            connections.add(line)
            
            # Add weight label
            mid_point = (hidden_pos + output_pos) / 2
            weight_label = Text(f"{weight:.1f}", font_size=12, color=YELLOW)
            weight_label.move_to(mid_point + 0.2 * UP)
            weight_labels.add(weight_label)
        
        # Show network structure
        self.play(Create(connections))
        self.play(Create(input_neurons))
        self.play(Create(hidden_neurons))
        self.play(Create(output_neuron))
        self.play(Create(weight_labels))
        
        # Calculate hidden layer values
        hidden_inputs = np.dot(input_values, weights_ih)  # [1.08, 0.66, 0.22]
        hidden_outputs = [max(0, x) for x in hidden_inputs]  # ReLU activation
        
        # Show calculations - fade out other elements first for important text
        self.play(FadeOut(section1, network_title))
        
        calc_text = Text("Hidden Layer Calculations:", font_size=24, color=WHITE)
        calc_text.to_edge(UP)
        self.play(Write(calc_text))
        
        # Show calculation for first hidden neuron
        calc1 = MathTex(r"h_1 = \text{ReLU}(0.8 \times 0.5 + 0.6 \times 0.4) = \text{ReLU}(0.64) = 0.64")
        calc1.scale(0.6)
        calc1.to_edge(DOWN)
        self.play(Write(calc1))
        
        # Update hidden neuron values with color changes
        for i, value in enumerate(hidden_outputs):
            value_label = Text(f"{value:.2f}", font_size=16, color=WHITE)
            value_label.move_to(hidden_neurons[i].get_center())
            self.play(Write(value_label))
            self.play(hidden_neurons[i].animate.set_color(ORANGE), run_time=0.5)
        
        self.wait(2)
        
        # Calculate output
        output_input = np.dot(hidden_outputs, weights_ho)  # 0.64*0.6 + 0.66*0.3 + 0.22*0.8
        output_value = 1 / (1 + np.exp(-output_input))  # Sigmoid activation
        
        # Show output calculation
        calc2 = MathTex(r"output = \sigma(0.64 \times 0.6 + 0.66 \times 0.3 + 0.22 \times 0.8)")
        calc2.scale(0.6)
        calc2.to_corner(DL)
        self.play(Write(calc2))
        
        calc3 = MathTex(rf"output = \sigma(0.758) = {output_value:.3f}")
        calc3.scale(0.6)
        calc3.to_corner(DR)
        self.play(Write(calc3))
        
        # Update output neuron value with color change
        output_label = Text(f"{output_value:.3f}", font_size=16, color=WHITE)
        output_label.move_to(output_neuron.get_center())
        self.play(Write(output_label))
        self.play(output_neuron.animate.set_color(PURPLE), run_time=0.5)
        
        self.wait(2)
        
        # Clear calculations
        self.play(FadeOut(calc_text, calc1, calc2, calc3))
        
        # Part 2: Loss Calculation
        section2 = Text("Part 2: Loss Calculation", font_size=48, color=ORANGE)
        section2.to_edge(UP)
        
        self.play(Write(section2))
        self.wait(1.5)
        
        # Show loss calculation
        loss_title = Text("Calculating the Error", font_size=32, color=WHITE)
        loss_title.to_edge(DOWN)
        self.play(Write(loss_title))
        
        # Target value
        target_value = 1.0
        target_text = Text(f"Target: {target_value:.1f}", font_size=28, color=GREEN)
        target_text.to_corner(UL)
        self.play(Write(target_text))
        
        # Error calculation
        error = target_value - output_value
        loss = 0.5 * error ** 2
        
        # Fade out network elements for important calculations
        self.play(FadeOut(connections, input_neurons, hidden_neurons, output_neuron, weight_labels))
        
        error_calc = MathTex(rf"Error = Target - Prediction = {target_value:.1f} - {output_value:.3f} = {error:.3f}")
        error_calc.scale(0.7)
        error_calc.move_to(ORIGIN + UP)
        self.play(Write(error_calc))
        
        loss_calc = MathTex(rf"Loss = \frac{{1}}{{2}} \times Error^2 = \frac{{1}}{{2}} \times {error:.3f}^2 = {loss:.4f}")
        loss_calc.scale(0.7)
        loss_calc.move_to(ORIGIN + DOWN)
        self.play(Write(loss_calc))
        
        self.wait(2)
        
        # Part 3: Backpropagation
        self.play(FadeOut(section2, loss_title, target_text, error_calc, loss_calc))
        
        section3 = Text("Part 3: Backpropagation", font_size=48, color=PURPLE)
        section3.to_edge(UP)
        
        self.play(Write(section3))
        self.wait(1.5)
        
        # Show backpropagation
        backprop_title = Text("Adjusting Weights with Gradients", font_size=32, color=WHITE)
        backprop_title.to_edge(DOWN)
        self.play(Write(backprop_title))
        
        # Recreate network for backpropagation visualization
        self.play(Create(connections))
        self.play(Create(input_neurons))
        self.play(Create(hidden_neurons))
        self.play(Create(output_neuron))
        self.play(Create(weight_labels))
        
        # Highlight the learning process
        learning_text = Text("Weights are adjusted to minimize loss", font_size=24, color=WHITE)
        learning_text.to_corner(UL)
        self.play(Write(learning_text))
        
        # Show gradient flow backwards with color changes
        gradient_arrows = VGroup()
        
        # Output to hidden gradients
        for i in range(3):
            hidden_pos = hidden_neurons[i].get_center()
            output_pos = output_neuron.get_center()
            
            arrow = Arrow(output_pos, hidden_pos, color=PURPLE, stroke_width=3)
            gradient_arrows.add(arrow)
        
        # Hidden to input gradients
        for i in range(2):
            for j in range(3):
                input_pos = input_neurons[i][0].get_center()
                hidden_pos = hidden_neurons[j].get_center()
                
                arrow = Arrow(hidden_pos, input_pos, color=PURPLE, stroke_width=2)
                gradient_arrows.add(arrow)
        
        self.play(Create(gradient_arrows))
        
        # Show backpropagation with color changes
        self.play(output_neuron.animate.set_color(PINK), run_time=0.5)
        for i in range(3):
            self.play(hidden_neurons[i].animate.set_color(PINK), run_time=0.3)
        for i in range(2):
            self.play(input_neurons[i][0].animate.set_color(PINK), run_time=0.3)
        
        self.wait(1)
        
        # Show weight updates
        update_text = Text("New Weight = Old Weight - Learning Rate × Gradient", font_size=20, color=YELLOW)
        update_text.to_corner(DR)
        self.play(Write(update_text))
        
        # Animate weight changes with color changes
        for label in weight_labels:
            self.play(label.animate.set_color(PINK), run_time=0.2)
        
        # Reset weight label colors
        for label in weight_labels:
            self.play(label.animate.set_color(YELLOW), run_time=0.2)
        
        self.wait(2)
        
        # Clear everything for summary
        self.play(FadeOut(
            section3, backprop_title, learning_text, update_text, gradient_arrows,
            connections, input_neurons, hidden_neurons, output_neuron, weight_labels
        ))
        
        # Final summary - important text in center, everything else faded out
        summary_title = Text("Training Process Summary", font_size=48, color=YELLOW)
        summary_title.to_edge(UP)
        
        takeaways = VGroup(
            Text("1. Forward Pass: Data flows through network with weighted connections", font_size=26, color=WHITE),
            Text("2. Loss Calculation: Compare prediction with target to measure error", font_size=26, color=WHITE),
            Text("3. Backpropagation: Calculate gradients to determine weight adjustments", font_size=26, color=WHITE),
            Text("4. Weight Update: Adjust weights to minimize loss and improve accuracy", font_size=26, color=WHITE),
            Text("5. Repeat: Process continues until network learns the pattern", font_size=26, color=WHITE)
        ).arrange(DOWN, buff=0.6, aligned_edge=LEFT)
        takeaways.move_to(ORIGIN)
        
        self.play(Write(summary_title))
        self.play(LaggedStart(*[Write(takeaway) for takeaway in takeaways], lag_ratio=0.7))
        self.wait(3)
        
        # Ending message
        ending = Text("This is how neural networks learn! 🧠✨", font_size=36, color=BLUE)
        ending.to_edge(DOWN)
        
        self.play(Write(ending))
        self.wait(2)
        
        # Fade out everything
        self.play(FadeOut(*self.mobjects))
        self.wait(1) 