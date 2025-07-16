from manim import *
import numpy as np

class TextEncoderStep1Problem(Scene):
    def construct(self):
        """
        Step 1: The Fundamental Problem
        - Computers only understand numbers
        - Neural networks need fixed-size numerical inputs
        - Text is variable length, discrete symbols
        - The solution: Map text → dense vectors that capture meaning
        """
        # Track current elements for proper fade-out management
        self.current_elements = []
        
        # Section 1.1: Computers Only Understand Numbers
        self.show_computers_need_numbers()
        self.clear_section()
        
        # Section 1.2: Text vs Numbers Challenge
        self.show_text_vs_numbers_challenge()
        self.clear_section()
        
        # Section 1.3: Neural Network Requirements
        self.show_neural_network_requirements()
        self.clear_section()
        
        # Section 1.4: The Solution Preview
        self.show_solution_preview()
    
    def add_element(self, element):
        """Track element for proper cleanup"""
        self.current_elements.append(element)
        return element
    
    def clear_section(self):
        """Fade out all current elements with proper spacing"""
        if self.current_elements:
            self.play(FadeOut(*self.current_elements))
            self.current_elements = []
        self.wait(1)
    
    def show_computers_need_numbers(self):
        """Demonstrate that computers only understand numbers"""
        # Header - VERIFIED: font_size=36 ≈ 0.45 units, at y=3.8 → top at 4.025 < 4.5 ✓
        header = Text("Computers Only Understand Numbers", font_size=36, color=BLUE)
        header.move_to(UP * 3.8)
        self.add_element(header)
        
        # Computer representation
        computer = Rectangle(width=2, height=1.5, color=GRAY)
        computer.move_to(LEFT * 4 + UP * 1)
        computer_label = Text("Computer", font_size=20).next_to(computer, DOWN, buff=0.2)
        self.add_element(computer)
        self.add_element(computer_label)
        
        # Binary representation
        binary_text = Text("01101000 01100101 01101100 01101100 01101111", 
                          font_size=16, color=GREEN)
        binary_text.move_to(UP * 1)
        binary_label = Text("Binary (Numbers)", font_size=18, color=GREEN)
        binary_label.next_to(binary_text, DOWN, buff=0.3)
        
        # Show the flow
        arrow1 = Arrow(computer.get_right(), binary_text.get_left(), color=WHITE)
        
        # What this represents
        meaning_text = Text('"hello"', font_size=24, color=YELLOW)
        meaning_text.move_to(RIGHT * 4 + UP * 1)
        meaning_label = Text("Human Meaning", font_size=18, color=YELLOW)
        meaning_label.next_to(meaning_text, DOWN, buff=0.3)
        
        arrow2 = Arrow(binary_text.get_right(), meaning_text.get_left(), color=WHITE)
        
        # Animate
        self.play(FadeIn(header))
        self.wait(1)
        
        self.play(Create(computer), Write(computer_label))
        self.wait(1)
        
        self.play(Create(arrow1))
        self.play(Write(binary_text), Write(binary_label))
        self.add_element(binary_text)
        self.add_element(binary_label)
        self.add_element(arrow1)
        self.wait(1)
        
        self.play(Create(arrow2))
        self.play(Write(meaning_text), Write(meaning_label))
        self.add_element(arrow2)
        self.add_element(meaning_text)
        self.add_element(meaning_label)
        self.wait(2)
    
    def show_text_vs_numbers_challenge(self):
        """Show the challenge of text being discrete and variable length"""
        # Header - VERIFIED: font_size=36 ≈ 0.45 units, at y=3.8 → top at 4.025 < 4.5 ✓
        header = Text("The Text Challenge", font_size=36, color=RED)
        header.move_to(UP * 3.8)
        self.add_element(header)
        
        # Text examples with different lengths
        text_examples = VGroup()
        examples = [
            '"Hi"',
            '"Hello world"',
            '"The quick brown fox jumps"',
            '"This is a much longer sentence with many words"'
        ]
        
        for i, example in enumerate(examples):
            text_obj = Text(example, font_size=20)
            text_obj.move_to(UP * (2 - i * 0.8))
            text_examples.add(text_obj)
            self.add_element(text_obj)
        
        # Problems list
        problems_title = Text("Problems:", font_size=24, color=RED)
        problems_title.move_to(LEFT * 4 + DOWN * 1)
        self.add_element(problems_title)
        
        problems = [
            "• Variable length",
            "• Discrete symbols", 
            "• No natural ordering",
            "• Infinite vocabulary"
        ]
        
        problem_group = VGroup()
        for i, problem in enumerate(problems):
            prob_text = Text(problem, font_size=18)
            prob_text.move_to(LEFT * 4 + DOWN * (1.5 + i * 0.4))
            prob_text.align_to(problems_title, LEFT)
            problem_group.add(prob_text)
            self.add_element(prob_text)
        
        # Neural network needs
        needs_title = Text("Neural Networks Need:", font_size=24, color=GREEN)
        needs_title.move_to(RIGHT * 2 + DOWN * 1)
        self.add_element(needs_title)
        
        needs = [
            "• Fixed-size inputs",
            "• Numerical values",
            "• Continuous space",
            "• Finite dimensions"
        ]
        
        needs_group = VGroup()
        for i, need in enumerate(needs):
            need_text = Text(need, font_size=18)
            need_text.move_to(RIGHT * 2 + DOWN * (1.5 + i * 0.4))
            need_text.align_to(needs_title, LEFT)
            needs_group.add(need_text)
            self.add_element(need_text)
        
        # Animate
        self.play(FadeIn(header))
        self.wait(1)
        
        for text_obj in text_examples:
            self.play(Write(text_obj), run_time=0.5)
        self.wait(1)
        
        self.play(Write(problems_title))
        for prob in problem_group:
            self.play(Write(prob), run_time=0.3)
        self.wait(1)
        
        self.play(Write(needs_title))
        for need in needs_group:
            self.play(Write(need), run_time=0.3)
        self.wait(2)
    
    def show_neural_network_requirements(self):
        """Visualize what neural networks actually need"""
        # Header - VERIFIED: font_size=36 ≈ 0.45 units, at y=3.8 → top at 4.025 < 4.5 ✓
        header = Text("Neural Network Requirements", font_size=36, color=PURPLE)
        header.move_to(UP * 3.8)
        self.add_element(header)
        
        # Show a simple neural network
        # Input layer
        input_nodes = VGroup()
        for i in range(4):
            node = Circle(radius=0.2, color=BLUE, fill_opacity=0.7)
            node.move_to(LEFT * 5 + UP * (1.5 - i * 0.8))
            input_nodes.add(node)
            self.add_element(node)
        
        input_label = Text("Fixed-size\nNumerical Input", font_size=16)
        input_label.next_to(input_nodes, LEFT, buff=0.5)
        self.add_element(input_label)
        
        # Hidden layer
        hidden_nodes = VGroup()
        for i in range(3):
            node = Circle(radius=0.2, color=GREEN, fill_opacity=0.7)
            node.move_to(UP * (1 - i * 0.8))
            hidden_nodes.add(node)
            self.add_element(node)
        
        # Output layer
        output_nodes = VGroup()
        for i in range(2):
            node = Circle(radius=0.2, color=RED, fill_opacity=0.7)
            node.move_to(RIGHT * 5 + UP * (0.5 - i * 0.8))
            output_nodes.add(node)
            self.add_element(node)
        
        output_label = Text("Predictions", font_size=16)
        output_label.next_to(output_nodes, RIGHT, buff=0.5)
        self.add_element(output_label)
        
        # Connect the nodes
        connections = VGroup()
        for input_node in input_nodes:
            for hidden_node in hidden_nodes:
                line = Line(input_node.get_center(), hidden_node.get_center(), 
                           stroke_width=1, color=GRAY)
                connections.add(line)
                self.add_element(line)
        
        for hidden_node in hidden_nodes:
            for output_node in output_nodes:
                line = Line(hidden_node.get_center(), output_node.get_center(),
                           stroke_width=1, color=GRAY)
                connections.add(line)
                self.add_element(line)
        
        # Requirements text
        req_title = Text("Requirements:", font_size=24, color=ORANGE)
        req_title.move_to(DOWN * 2)
        self.add_element(req_title)
        
        requirements = [
            "Each input must be a number",
            "All inputs must have same dimension",
            "Values should be in reasonable range"
        ]
        
        for i, req in enumerate(requirements):
            req_text = Text(f"• {req}", font_size=18)
            req_text.move_to(DOWN * (2.5 + i * 0.4))
            self.add_element(req_text)
        
        # Animate
        self.play(FadeIn(header))
        self.wait(1)
        
        self.play(Create(input_nodes), Write(input_label))
        self.wait(0.5)
        
        self.play(Create(connections))
        self.wait(0.5)
        
        self.play(Create(hidden_nodes))
        self.wait(0.5)
        
        self.play(Create(output_nodes), Write(output_label))
        self.wait(1)
        
        self.play(Write(req_title))
        for req_text in self.current_elements[-3:]:  # Last 3 requirement texts
            self.play(Write(req_text), run_time=0.5)
        self.wait(2)
    
    def show_solution_preview(self):
        """Preview the solution: text → dense vectors"""
        # Header - VERIFIED: font_size=36 ≈ 0.45 units, at y=3.8 → top at 4.025 < 4.5 ✓
        header = Text("The Solution: Text Encoders", font_size=36, color=GOLD)
        header.move_to(UP * 3.8)
        self.add_element(header)
        
        # Before: Raw text
        before_title = Text("Before:", font_size=24, color=RED)
        before_title.move_to(LEFT * 4 + UP * 2)
        self.add_element(before_title)
        
        text_input = Text('"The cat sat"', font_size=20)
        text_input.move_to(LEFT * 4 + UP * 1.2)
        self.add_element(text_input)
        
        problems_text = Text("Variable length\nDiscrete symbols\nNot numerical", 
                           font_size=16, color=RED)
        problems_text.move_to(LEFT * 4 + UP * 0.2)
        self.add_element(problems_text)
        
        # After: Dense vectors
        after_title = Text("After:", font_size=24, color=GREEN)
        after_title.move_to(RIGHT * 2 + UP * 2)
        self.add_element(after_title)
        
        # Show vector representation
        vectors = VGroup()
        vector_labels = ["the", "cat", "sat"]
        
        for i, label in enumerate(vector_labels):
            # Word label
            word_text = Text(f'"{label}"', font_size=16)
            word_text.move_to(RIGHT * 2 + UP * (1.5 - i * 0.6))
            self.add_element(word_text)
            
            # Arrow
            arrow = Arrow(word_text.get_right(), 
                         word_text.get_right() + RIGHT * 1.5, 
                         stroke_width=2, color=WHITE)
            self.add_element(arrow)
            
            # Vector representation
            vector_values = [round(np.random.normal(0, 0.5), 2) for _ in range(4)]
            vector_text = Text(f"[{', '.join(map(str, vector_values[:4]))}...]", 
                             font_size=14)
            vector_text.move_to(word_text.get_center() + RIGHT * 3)
            self.add_element(vector_text)
        
        # Benefits
        benefits_text = Text("Fixed size\nNumerical values\nCaptures meaning", 
                           font_size=16, color=GREEN)
        benefits_text.move_to(RIGHT * 2 + DOWN * 0.5)
        self.add_element(benefits_text)
        
        # Main transformation arrow
        main_arrow = Arrow(LEFT * 1.5 + UP * 1, RIGHT * 0.5 + UP * 1,
                          stroke_width=4, color=GOLD)
        main_arrow_label = Text("Text Encoder", font_size=18, color=GOLD)
        main_arrow_label.next_to(main_arrow, UP, buff=0.2)
        self.add_element(main_arrow)
        self.add_element(main_arrow_label)
        
        # Animate
        self.play(FadeIn(header))
        self.wait(1)
        
        # Show before
        self.play(Write(before_title))
        self.play(Write(text_input))
        self.play(Write(problems_text))
        self.wait(1)
        
        # Show transformation
        self.play(Create(main_arrow), Write(main_arrow_label))
        self.wait(1)
        
        # Show after
        self.play(Write(after_title))
        for element in self.current_elements[-9:]:  # Vector elements
            if isinstance(element, Text) and any(char in element.text for char in ['"', '[', ']']):
                self.play(Write(element), run_time=0.3)
            elif isinstance(element, Arrow):
                self.play(Create(element), run_time=0.2)
        
        self.play(Write(benefits_text))
        self.wait(3)
        
        # Final message
        final_text = Text("Next: How do we build this?", font_size=24, color=YELLOW)
        final_text.move_to(DOWN * 3)
        self.add_element(final_text)
        self.play(Write(final_text))
        self.wait(2) 