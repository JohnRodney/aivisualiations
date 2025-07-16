from manim import (
    Scene, Text, VGroup, Dot, Line, Arrow, Rectangle, Circle, MathTex, Table,
    FadeIn, FadeOut, Write, Transform, Create, AnimationGroup,
    RIGHT, LEFT, UP, DOWN, ORIGIN, UL, UR, DL, DR,
    BLUE, RED, GREEN, YELLOW, ORANGE, WHITE, PURPLE, PINK, GRAY,
    ValueTracker, always_redraw, Indicate, Flash,
    LaggedStart, Wait, Succession, NumberPlane, Axes, Code
)
import numpy as np

class TextEncoderExplained(Scene):
    def construct(self):
        # Screen dimensions for reference: typically 16:9, let's manage our space carefully
        # Title sequence - full screen, then clear
        title = Text("Building a Text Encoder", font_size=48, color=BLUE)
        subtitle = Text("Step-by-Step Guide", font_size=28, color=WHITE)
        subtitle.shift(DOWN * 0.8)
        
        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))
        
        # Part 1: The Problem
        # Header at top, content in center, clear separation
        header = Text("Part 1: The Problem", font_size=36, color=RED)
        header.to_edge(UP, buff=0.5)
        self.play(Write(header))
        
        # Center content with proper spacing
        problem_statement = Text("Computers only understand numbers", font_size=32, color=WHITE)
        problem_statement.move_to(ORIGIN + UP * 1)
        
        self.play(Write(problem_statement))
        self.wait(1)
        
        # Clear example with controlled positioning
        text_input = Text('"Hello"', font_size=28, color=GREEN)
        text_input.move_to(ORIGIN + LEFT * 2)
        
        arrow = Arrow(LEFT * 0.5, RIGHT * 0.5, color=YELLOW)
        arrow.move_to(ORIGIN)
        
        numbers_output = Text("[7, 4, 11, 11, 14]", font_size=24, color=ORANGE)
        numbers_output.move_to(ORIGIN + RIGHT * 2.5)
        
        question = Text("How?", font_size=24, color=RED)
        question.move_to(ORIGIN + DOWN * 1)
        
        self.play(Write(text_input))
        self.play(Create(arrow))
        self.play(Write(numbers_output))
        self.play(Write(question))
        self.wait(2)
        
        # Clear everything for next section
        self.play(FadeOut(header, problem_statement, text_input, arrow, numbers_output, question))
        
        # Part 2: Character Encoding
        # Consistent header positioning
        header2 = Text("Step 1: Character Encoding", font_size=36, color=GREEN)
        header2.to_edge(UP, buff=0.5)
        self.play(Write(header2))
        
        # Explanation in upper area, leave space for table below
        explanation = Text("Build a character vocabulary", font_size=24, color=WHITE)
        explanation.move_to(ORIGIN + UP * 2)
        self.play(Write(explanation))
        
        # Sample text in upper left
        sample = Text('Sample: "Hello"', font_size=20, color=YELLOW)
        sample.to_corner(UL, buff=1)
        sample.shift(DOWN * 1.5)  # Move down from corner
        self.play(Write(sample))
        
        # Character vocabulary table - center stage
        chars = ['H', 'e', 'l', 'o']
        unique_chars = list(set(chars))
        unique_chars.sort()
        
        vocab_data = [["Char", "ID"]]
        for i, char in enumerate(unique_chars):
            vocab_data.append([f'"{char}"', str(i)])
        
        vocab_table = Table(vocab_data, include_outer_lines=True)
        vocab_table.scale(0.7)
        vocab_table.move_to(ORIGIN + LEFT * 2)
        
        self.play(Create(vocab_table))
        self.wait(1)
        
        # Encoding demo on the right
        encoding_title = Text("Encoding:", font_size=20, color=ORANGE)
        encoding_title.move_to(ORIGIN + RIGHT * 2 + UP * 1.5)
        self.play(Write(encoding_title))
        
        # Show character mapping step by step, positioned carefully
        char_to_id = {char: i for i, char in enumerate(unique_chars)}
        mapping_text = f'"Hello" → {[char_to_id[c] for c in "Hello"]}'
        
        result = Text(mapping_text, font_size=18, color=BLUE)
        result.move_to(ORIGIN + RIGHT * 2)
        self.play(Write(result))
        self.wait(2)
        
        # Clear this section completely
        self.play(FadeOut(header2, explanation, sample, vocab_table, encoding_title, result))
        
        # Part 3: Word Encoding 
        header3 = Text("Step 2: Word Encoding", font_size=36, color=PURPLE)
        header3.to_edge(UP, buff=0.5)
        self.play(Write(header3))
        
        # Better approach explanation
        better_text = Text("Better: encode whole words", font_size=24, color=WHITE)
        better_text.move_to(ORIGIN + UP * 2)
        self.play(Write(better_text))
        
        # Sample sentence in designated area
        sentence_sample = Text('Text: "the cat sat"', font_size=20, color=YELLOW)
        sentence_sample.to_corner(UL, buff=1)
        sentence_sample.shift(DOWN * 1.5)
        self.play(Write(sentence_sample))
        
        # Tokenization demo
        tokens_title = Text("Tokenization:", font_size=20, color=GREEN)
        tokens_title.move_to(ORIGIN + UP * 0.5)
        self.play(Write(tokens_title))
        
        # Show tokens in a controlled line
        tokens = ["the", "cat", "sat"]
        token_display = VGroup()
        for i, token in enumerate(tokens):
            token_text = Text(f'"{token}"', font_size=18, color=ORANGE)
            token_text.move_to(ORIGIN + LEFT * 2 + RIGHT * (i * 1.5))
            token_display.add(token_text)
        
        self.play(LaggedStart(*[Write(token) for token in token_display], lag_ratio=0.3))
        self.wait(1)
        
        # Word vocabulary table - positioned below
        word_vocab_data = [["Word", "ID"]]
        for i, token in enumerate(tokens):
            word_vocab_data.append([f'"{token}"', str(i)])
        
        word_table = Table(word_vocab_data, include_outer_lines=True)
        word_table.scale(0.7)
        word_table.move_to(ORIGIN + DOWN * 1.5)
        
        self.play(Create(word_table))
        self.wait(2)
        
        # Clear everything for next section
        self.play(FadeOut(header3, better_text, sentence_sample, tokens_title, token_display, word_table))
        
        # Part 4: Unknown Words
        header4 = Text("Step 3: Unknown Words", font_size=36, color=RED)
        header4.to_edge(UP, buff=0.5)
        self.play(Write(header4))
        
        # Problem demonstration with clear positioning
        problem_title = Text("The Problem:", font_size=24, color=WHITE)
        problem_title.move_to(ORIGIN + UP * 2)
        self.play(Write(problem_title))
        
        # Known vocabulary 
        known_vocab = Text("Vocabulary: [the, cat, sat]", font_size=20, color=GREEN)
        known_vocab.move_to(ORIGIN + UP * 1)
        self.play(Write(known_vocab))
        
        # New text with unknown word
        new_text = Text('New: "the dog sat"', font_size=20, color=WHITE)
        new_text.move_to(ORIGIN)
        self.play(Write(new_text))
        
        # Highlight the problem
        unknown_problem = Text('"dog" = ???', font_size=20, color=RED)
        unknown_problem.move_to(ORIGIN + DOWN * 1)
        self.play(Write(unknown_problem))
        self.wait(1)
        
        # Solution with proper spacing
        solution_title = Text("Solution: Special Tokens", font_size=24, color=BLUE)
        solution_title.move_to(ORIGIN + DOWN * 2.5)
        self.play(Write(solution_title))
        self.wait(2)
        
        # Clear for special tokens demo
        self.play(FadeOut(problem_title, known_vocab, new_text, unknown_problem))
        
        # Special tokens table - center stage
        special_tokens_data = [
            ["Token", "Purpose"],
            ["<UNK>", "Unknown words"],
            ["<PAD>", "Padding"],
            ["<START>", "Begin sequence"],
            ["<END>", "End sequence"]
        ]
        
        special_table = Table(special_tokens_data, include_outer_lines=True)
        special_table.scale(0.8)
        special_table.move_to(ORIGIN + UP * 0.5)
        
        self.play(Create(special_table))
        self.wait(2)
        
        # Clear this section
        self.play(FadeOut(header4, solution_title, special_table))
        
        # Part 5: Complete Example
        header5 = Text("Complete Example", font_size=36, color=BLUE)
        header5.to_edge(UP, buff=0.5)
        self.play(Write(header5))
        
        # Example with clear steps
        example_title = Text('Encode: "the dog sat"', font_size=24, color=WHITE)
        example_title.move_to(ORIGIN + UP * 2.5)
        self.play(Write(example_title))
        
        # Step by step with proper vertical spacing
        steps = [
            ("1. Tokenize:", '["the", "dog", "sat"]'),
            ("2. Add special:", '["<START>", "the", "dog", "sat", "<END>"]'),
            ("3. Map to IDs:", "[2, 0, 1, 0, 3]"),
            ("4. Final result:", "[2, 0, 1, 0, 3]")
        ]
        
        step_group = VGroup()
        for i, (label, content) in enumerate(steps):
            step_label = Text(label, font_size=18, color=YELLOW)
            step_content = Text(content, font_size=16, color=GREEN)
            step_line = VGroup(step_label, step_content).arrange(RIGHT, buff=0.5)
            step_line.move_to(ORIGIN + UP * (1.5 - i * 0.7))
            step_group.add(step_line)
        
        for step in step_group:
            self.play(Write(step), run_time=0.8)
            self.wait(0.3)
        
        # Highlight unknown word handling
        highlight = Text('"dog" → 1 (<UNK>)', font_size=18, color=RED)
        highlight.move_to(ORIGIN + DOWN * 2)
        self.play(Write(highlight))
        self.wait(2)
        
        # Clear for final summary
        self.play(FadeOut(header5, example_title, step_group, highlight))
        
        # Final Summary - clean, centered
        summary_title = Text("Text Encoder Complete!", font_size=40, color=GREEN)
        summary_title.move_to(ORIGIN + UP * 1.5)
        self.play(Write(summary_title))
        
        # Key takeaways with proper spacing
        takeaways = VGroup(
            Text("✓ Convert text to numbers", font_size=24, color=WHITE),
            Text("✓ Handle unknown words", font_size=24, color=WHITE),
            Text("✓ Use special tokens", font_size=24, color=WHITE),
            Text("✓ Ready for ML models!", font_size=24, color=WHITE)
        ).arrange(DOWN, buff=0.4, aligned_edge=LEFT)
        takeaways.move_to(ORIGIN + DOWN * 0.5)
        
        self.play(LaggedStart(*[Write(takeaway) for takeaway in takeaways], lag_ratio=0.5))
        self.wait(2)
        
        # Final message
        final_msg = Text("You can build your own encoder! 🎉", font_size=28, color=YELLOW)
        final_msg.move_to(ORIGIN + DOWN * 2.5)
        self.play(Write(final_msg))
        self.wait(2)
        
        # Fade everything out
        self.play(FadeOut(*self.mobjects))
        self.wait(1) 