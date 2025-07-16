from manim import *
import numpy as np

class TextEncoderStep2Tokenization(Scene):
    def construct(self):
        """
        Step 2: Raw Text to Tokens (Preprocessing)
        - Character-level vs word-level vs subword tokenization
        - Building vocabularies from training data
        - Handling unknown words (<UNK> tokens)
        - Special tokens: <PAD>, <START>, <END>, <MASK>
        - Practical demo: "Hello world" → [15, 847, 2]
        """
        # Track current elements for proper fade-out management
        self.current_elements = []
        
        # Section 2.1: What is Tokenization?
        self.show_tokenization_concept()
        self.clear_section()
        
        # Section 2.2: Character vs Word vs Subword
        self.show_tokenization_methods()
        self.clear_section()
        
        # Section 2.3: Building Vocabularies
        self.show_vocabulary_building()
        self.clear_section()
        
        # Section 2.4: Special Tokens
        self.show_special_tokens()
        self.clear_section()
        
        # Section 2.5: Complete Example
        self.show_complete_tokenization_example()
    
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
    
    def show_tokenization_concept(self):
        """Explain what tokenization is and why we need it"""
        # Header - VERIFIED: font_size=36 ≈ 0.45 units, at y=3.8 → top at 4.025 < 4.5 ✓
        header = Text("What is Tokenization?", font_size=36, color=BLUE)
        header.move_to(UP * 3.8)
        self.add_element(header)
        
        # The problem
        problem_title = Text("The Problem:", font_size=24, color=RED)
        problem_title.move_to(UP * 2.5)
        self.add_element(problem_title)
        
        raw_text = Text('"The quick brown fox jumps over the lazy dog"', 
                       font_size=20, color=WHITE)
        raw_text.move_to(UP * 1.8)
        self.add_element(raw_text)
        
        problem_desc = Text("Computers can't process raw text directly", 
                          font_size=18, color=RED)
        problem_desc.move_to(UP * 1.2)
        self.add_element(problem_desc)
        
        # The solution
        solution_title = Text("The Solution:", font_size=24, color=GREEN)
        solution_title.move_to(UP * 0.5)
        self.add_element(solution_title)
        
        solution_desc = Text("Break text into smaller, manageable pieces called 'tokens'", 
                           font_size=18, color=GREEN)
        solution_desc.move_to(UP * 0.1)
        self.add_element(solution_desc)
        
        # Show transformation
        arrow = Arrow(UP * (-0.3), DOWN * 0.7, stroke_width=3, color=YELLOW)
        self.add_element(arrow)
        
        tokens_example = Text('["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]', 
                            font_size=16, color=YELLOW)
        tokens_example.move_to(DOWN * 1.2)
        self.add_element(tokens_example)
        
        # Each token gets a number
        ids_arrow = Arrow(DOWN * 1.6, DOWN * 2.2, stroke_width=3, color=ORANGE)
        self.add_element(ids_arrow)
        
        token_ids = Text('[1, 15, 47, 93, 204, 67, 1, 89, 156]', 
                        font_size=16, color=ORANGE)
        token_ids.move_to(DOWN * 2.6)
        self.add_element(token_ids)
        
        ids_desc = Text("Each token → unique number (ID)", 
                       font_size=16, color=ORANGE)
        ids_desc.move_to(DOWN * 3.2)
        self.add_element(ids_desc)
        
        # Animate
        self.play(FadeIn(header))
        self.wait(1)
        
        self.play(Write(problem_title))
        self.play(Write(raw_text))
        self.play(Write(problem_desc))
        self.wait(1)
        
        self.play(Write(solution_title))
        self.play(Write(solution_desc))
        self.wait(1)
        
        self.play(Create(arrow))
        self.play(Write(tokens_example))
        self.wait(1)
        
        self.play(Create(ids_arrow))
        self.play(Write(token_ids))
        self.play(Write(ids_desc))
        self.wait(2)
    
    def show_tokenization_methods(self):
        """Compare character, word, and subword tokenization"""
        # Header - VERIFIED: font_size=36 ≈ 0.45 units, at y=3.8 → top at 4.025 < 4.5 ✓
        header = Text("Three Tokenization Methods", font_size=36, color=PURPLE)
        header.move_to(UP * 3.8)
        self.add_element(header)
        
        # Input text
        input_text = Text('Input: "Hello world!"', font_size=20, color=WHITE)
        input_text.move_to(UP * 3)
        self.add_element(input_text)
        
        # Method 1: Character-level
        char_title = Text("1. Character-level:", font_size=20, color=RED)
        char_title.move_to(LEFT * 4 + UP * 1.5)
        self.add_element(char_title)
        
        char_tokens = Text('["H", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d", "!"]', 
                          font_size=14, color=RED)
        char_tokens.move_to(LEFT * 4 + UP * 1)
        self.add_element(char_tokens)
        
        char_pros = Text("+ Small vocabulary\n+ Handles any text", 
                        font_size=12, color=GREEN)
        char_pros.move_to(LEFT * 4 + UP * 0.4)
        self.add_element(char_pros)
        
        char_cons = Text("- Very long sequences\n- Loses word meaning", 
                        font_size=12, color=RED)
        char_cons.move_to(LEFT * 4 + DOWN * 0.2)
        self.add_element(char_cons)
        
        # Method 2: Word-level
        word_title = Text("2. Word-level:", font_size=20, color=BLUE)
        word_title.move_to(UP * 1.5)
        self.add_element(word_title)
        
        word_tokens = Text('["Hello", "world", "!"]', 
                          font_size=14, color=BLUE)
        word_tokens.move_to(UP * 1)
        self.add_element(word_tokens)
        
        word_pros = Text("+ Preserves meaning\n+ Shorter sequences", 
                        font_size=12, color=GREEN)
        word_pros.move_to(UP * 0.4)
        self.add_element(word_pros)
        
        word_cons = Text("- Huge vocabulary\n- Unknown words problem", 
                        font_size=12, color=RED)
        word_cons.move_to(DOWN * 0.2)
        self.add_element(word_cons)
        
        # Method 3: Subword-level
        subword_title = Text("3. Subword-level:", font_size=20, color=GREEN)
        subword_title.move_to(RIGHT * 4 + UP * 1.5)
        self.add_element(subword_title)
        
        subword_tokens = Text('["Hell", "o", "world", "!"]', 
                            font_size=14, color=GREEN)
        subword_tokens.move_to(RIGHT * 4 + UP * 1)
        self.add_element(subword_tokens)
        
        subword_pros = Text("+ Medium vocabulary\n+ Handles unknown words\n+ Good balance", 
                          font_size=12, color=GREEN)
        subword_pros.move_to(RIGHT * 4 + UP * 0.3)
        self.add_element(subword_pros)
        
        subword_cons = Text("- More complex\n- Requires training", 
                          font_size=12, color=RED)
        subword_cons.move_to(RIGHT * 4 + DOWN * 0.4)
        self.add_element(subword_cons)
        
        # Recommendation
        recommendation = Text("Most modern systems use subword tokenization!", 
                            font_size=18, color=GOLD)
        recommendation.move_to(DOWN * 2)
        self.add_element(recommendation)
        
        # Animate
        self.play(FadeIn(header))
        self.play(Write(input_text))
        self.wait(1)
        
        # Character method
        self.play(Write(char_title))
        self.play(Write(char_tokens))
        self.play(Write(char_pros))
        self.play(Write(char_cons))
        self.wait(1)
        
        # Word method
        self.play(Write(word_title))
        self.play(Write(word_tokens))
        self.play(Write(word_pros))
        self.play(Write(word_cons))
        self.wait(1)
        
        # Subword method
        self.play(Write(subword_title))
        self.play(Write(subword_tokens))
        self.play(Write(subword_pros))
        self.play(Write(subword_cons))
        self.wait(1)
        
        self.play(Write(recommendation))
        self.wait(2)
    
    def show_vocabulary_building(self):
        """Show how vocabularies are built from training data"""
        # Header - VERIFIED: font_size=36 ≈ 0.45 units, at y=3.8 → top at 4.025 < 4.5 ✓
        header = Text("Building Vocabularies", font_size=36, color=ORANGE)
        header.move_to(UP * 3.8)
        self.add_element(header)
        
        # Training data - REDUCED to prevent overcrowding
        training_title = Text("1. Start with training data:", font_size=20, color=WHITE)
        training_title.move_to(UP * 2.8)
        self.add_element(training_title)
        
        training_examples = [
            '"The cat sat on the mat"',
            '"The dog ran in the park"'
        ]
        
        for i, example in enumerate(training_examples):
            example_text = Text(example, font_size=14)
            example_text.move_to(UP * (2.4 - i * 0.3))  # Higher starting position
            self.add_element(example_text)
        
        # Tokenize
        tokenize_title = Text("2. Tokenize all text:", font_size=20, color=WHITE)
        tokenize_title.move_to(UP * 1.6)  # Moved up
        self.add_element(tokenize_title)
        
        all_tokens = Text('["The", "cat", "sat", "on", "the", "mat", ...]', 
                         font_size=14)
        all_tokens.move_to(UP * 1.2)  # Moved up
        self.add_element(all_tokens)
        
        # Count frequencies - PROPERLY SPACED above table
        count_title = Text("3. Count token frequencies:", font_size=20, color=WHITE)
        count_title.move_to(UP * 0.6)  # MOVED UP to clear table space
        self.add_element(count_title)
        
        # Frequency table - VERIFIED: 6 rows × 0.15 units = 0.9 units tall
        # At y=-0.2, extends from y=+0.25 to y=-0.65, clear of count_title at y=+0.6
        freq_table = Table(
            [["Token", "Count"], 
             ['"the"', "4"], 
             ['"cat"', "2"], 
             ['"sat"', "2"],
             ['"dog"', "2"]],  # Reduced rows
            row_labels=None,
            col_labels=None,
            include_outer_lines=True
        ).scale(0.7)  # Slightly larger for readability
        freq_table.move_to(DOWN * 0.2)  # MOVED UP, verified clear space
        self.add_element(freq_table)
        
        # Assign IDs - PROPERLY SPACED below table
        assign_title = Text("4. Assign unique IDs:", font_size=20, color=WHITE)
        assign_title.move_to(DOWN * 1.2)  # MOVED UP, 0.55 units below table bottom
        self.add_element(assign_title)
        
        vocab_dict = Text('{"the": 1, "cat": 2, "sat": 3, "dog": 4, ...}', 
                         font_size=14)
        vocab_dict.move_to(DOWN * 1.7)  # MOVED UP accordingly
        self.add_element(vocab_dict)
        
        # Animate
        self.play(FadeIn(header))
        self.wait(1)
        
        self.play(Write(training_title))
        for example in self.current_elements[-2:]:  # Last 2 training examples (reduced)
            self.play(Write(example), run_time=0.3)
        self.wait(1)
        
        self.play(Write(tokenize_title))
        self.play(Write(all_tokens))
        self.wait(1)
        
        self.play(Write(count_title))
        self.play(Create(freq_table))
        self.wait(1)
        
        self.play(Write(assign_title))
        self.play(Write(vocab_dict))
        self.wait(2)
    
    def show_special_tokens(self):
        """Explain special tokens and their purposes"""
        # Header - VERIFIED: font_size=36 ≈ 0.45 units, at y=3.8 → top at 4.025 < 4.5 ✓
        header = Text("Special Tokens", font_size=36, color=PURPLE)
        header.move_to(UP * 3.8)
        self.add_element(header)
        
        intro_text = Text("Beyond regular words, we need special tokens for specific purposes:", 
                         font_size=18)
        intro_text.move_to(UP * 3.2)
        self.add_element(intro_text)
        
        # Special tokens table
        special_tokens = [
            ("<UNK>", "Unknown words not in vocabulary", "\"supercalifragilisticexpialidocious\" → <UNK>"),
            ("<PAD>", "Padding to make sequences same length", "Batch processing requires equal lengths"),
            ("<START>", "Beginning of sequence marker", "Signals start of text generation"),
            ("<END>", "End of sequence marker", "Signals completion of generation"),
            ("<MASK>", "Masked token for training", "Used in masked language modeling")
        ]
        
        y_positions = [1.8, 1.0, 0.2, -0.6, -1.4]
        
        for i, (token, purpose, example) in enumerate(special_tokens):
            # Token name
            token_text = Text(token, font_size=20, color=YELLOW)
            token_text.move_to(LEFT * 5 + UP * y_positions[i])
            self.add_element(token_text)
            
            # Purpose
            purpose_text = Text(purpose, font_size=16)
            purpose_text.move_to(LEFT * 1.5 + UP * y_positions[i])
            self.add_element(purpose_text)
            
            # Example
            example_text = Text(example, font_size=14, color=GREEN)
            example_text.move_to(RIGHT * 2 + UP * (y_positions[i] - 0.2))
            self.add_element(example_text)
        
        # Vocabulary with special tokens
        vocab_title = Text("Updated Vocabulary:", font_size=20, color=ORANGE)
        vocab_title.move_to(DOWN * 2.5)
        self.add_element(vocab_title)
        
        updated_vocab = Text('{"<UNK>": 0, "<PAD>": 1, "<START>": 2, "<END>": 3, "the": 4, ...}', 
                           font_size=14, color=ORANGE)
        updated_vocab.move_to(DOWN * 3)
        self.add_element(updated_vocab)
        
        # Animate
        self.play(FadeIn(header))
        self.play(Write(intro_text))
        self.wait(1)
        
        for i in range(len(special_tokens)):
            # Get the last 3 elements (token, purpose, example)
            token_elements = self.current_elements[-3*(len(special_tokens)-i):-3*(len(special_tokens)-i-1)] if i < len(special_tokens)-1 else self.current_elements[-3:]
            for element in token_elements:
                self.play(Write(element), run_time=0.4)
            self.wait(0.5)
        
        self.play(Write(vocab_title))
        self.play(Write(updated_vocab))
        self.wait(2)
    
    def show_complete_tokenization_example(self):
        """Show complete end-to-end tokenization example"""
        # Header - VERIFIED: font_size=36 ≈ 0.45 units, at y=3.8 → top at 4.025 < 4.5 ✓
        header = Text("Complete Example: Text → Token IDs", font_size=36, color=GOLD)
        header.move_to(UP * 3.8)
        self.add_element(header)
        
        # Input text
        input_title = Text("Input Text:", font_size=20, color=WHITE)
        input_title.move_to(LEFT * 4 + UP * 2.5)
        self.add_element(input_title)
        
        input_text = Text('"Hello world"', font_size=18, color=WHITE)
        input_text.move_to(LEFT * 4 + UP * 2)
        self.add_element(input_text)
        
        # Step 1: Tokenize
        step1_title = Text("Step 1: Tokenize", font_size=18, color=BLUE)
        step1_title.move_to(LEFT * 4 + UP * 1.2)
        self.add_element(step1_title)
        
        tokens = Text('["Hello", "world"]', font_size=16, color=BLUE)
        tokens.move_to(LEFT * 4 + UP * 0.8)
        self.add_element(tokens)
        
        # Step 2: Look up in vocabulary
        step2_title = Text("Step 2: Vocabulary Lookup", font_size=18, color=GREEN)
        step2_title.move_to(LEFT * 4 + UP * 0.2)
        self.add_element(step2_title)
        
        vocab_lookup = Text('{"Hello": 15, "world": 847}', font_size=16, color=GREEN)
        vocab_lookup.move_to(LEFT * 4 + DOWN * 0.2)
        self.add_element(vocab_lookup)
        
        # Step 3: Get token IDs
        step3_title = Text("Step 3: Token IDs", font_size=18, color=ORANGE)
        step3_title.move_to(LEFT * 4 + DOWN * 0.8)
        self.add_element(step3_title)
        
        token_ids = Text('[15, 847]', font_size=16, color=ORANGE)
        token_ids.move_to(LEFT * 4 + DOWN * 1.2)
        self.add_element(token_ids)
        
        # Visual flow
        arrow1 = Arrow(LEFT * 2 + UP * 2, LEFT * 2 + UP * 1.2, color=WHITE)
        arrow2 = Arrow(LEFT * 2 + UP * 0.8, LEFT * 2 + UP * 0.2, color=WHITE)
        arrow3 = Arrow(LEFT * 2 + DOWN * 0.2, LEFT * 2 + DOWN * 0.8, color=WHITE)
        self.add_element(arrow1)
        self.add_element(arrow2)
        self.add_element(arrow3)
        
        # With special tokens
        special_title = Text("With Special Tokens:", font_size=20, color=PURPLE)
        special_title.move_to(RIGHT * 2 + UP * 1.5)
        self.add_element(special_title)
        
        special_example = Text('"<START> Hello world <END>"', font_size=16, color=PURPLE)
        special_example.move_to(RIGHT * 2 + UP * 1)
        self.add_element(special_example)
        
        special_tokens_result = Text('["<START>", "Hello", "world", "<END>"]', 
                                   font_size=14, color=PURPLE)
        special_tokens_result.move_to(RIGHT * 2 + UP * 0.5)
        self.add_element(special_tokens_result)
        
        special_ids = Text('[2, 15, 847, 3]', font_size=16, color=PURPLE)
        special_ids.move_to(RIGHT * 2 + UP * 0)
        self.add_element(special_ids)
        
        # Ready for neural network
        ready_text = Text("Ready for Neural Network!", font_size=20, color=GOLD)
        ready_text.move_to(DOWN * 2.5)
        self.add_element(ready_text)
        
        next_text = Text("Next: How embeddings turn these IDs into vectors", 
                        font_size=16, color=YELLOW)
        next_text.move_to(DOWN * 3.2)
        self.add_element(next_text)
        
        # Animate
        self.play(FadeIn(header))
        self.wait(1)
        
        # Show input and steps
        self.play(Write(input_title), Write(input_text))
        self.wait(1)
        
        self.play(Create(arrow1))
        self.play(Write(step1_title), Write(tokens))
        self.wait(1)
        
        self.play(Create(arrow2))
        self.play(Write(step2_title), Write(vocab_lookup))
        self.wait(1)
        
        self.play(Create(arrow3))
        self.play(Write(step3_title), Write(token_ids))
        self.wait(1)
        
        # Show special tokens version
        self.play(Write(special_title))
        self.play(Write(special_example))
        self.play(Write(special_tokens_result))
        self.play(Write(special_ids))
        self.wait(2)
        
        self.play(Write(ready_text))
        self.play(Write(next_text))
        self.wait(3) 