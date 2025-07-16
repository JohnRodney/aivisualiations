from manim import (
    Scene, Text, VGroup, Axes, Dot, Line, AnimationGroup,
    Write, FadeOut, Create, Transform,
    BLUE, WHITE, RED, GREEN, YELLOW, ORANGE, BLUE_C,
    DOWN, UP, LEFT, RIGHT, ORIGIN
)
import numpy as np

class LinearRegression30Second(Scene):
    def construct(self):
        # Title appears quickly
        title = Text("Linear Regression", font_size=56, color=BLUE)
        subtitle = Text("Finding the perfect line through data", font_size=28, color=WHITE)
        subtitle.next_to(title, DOWN)
        
        title_group = VGroup(title, subtitle)
        self.play(Write(title_group), run_time=1.5)
        self.wait(0.5)
        
        # Clear title and setup axes
        self.play(FadeOut(title_group), run_time=0.5)
        
        # Create axes
        axes = Axes(
            x_range=[0, 10, 2],
            y_range=[0, 10, 2],
            x_length=8,
            y_length=5,
            axis_config={"color": BLUE_C},
            tips=False,
        )
        
        # Data points that tell a story (house prices vs size)
        data_points = [
            (1, 2.5), (2, 3.2), (3, 4.1), (4, 4.8), (5, 5.9), 
            (6, 6.3), (7, 7.1), (8, 7.8), (9, 8.5)
        ]
        
        # Create dots
        dots = VGroup()
        for x, y in data_points:
            dot = Dot(axes.coords_to_point(x, y), color=YELLOW, radius=0.12)
            dots.add(dot)
        
        # Show axes and data points appearing one by one rapidly
        self.play(Create(axes), run_time=0.8)
        self.play(AnimationGroup(*[Create(dot) for dot in dots], lag_ratio=0.1), run_time=1.2)
        
        # Show problem: "Which line fits best?"
        problem_text = Text("Which line fits best?", font_size=32, color=RED)
        problem_text.to_edge(UP)
        self.play(Write(problem_text), run_time=0.8)
        
        # Show multiple bad lines quickly
        bad_lines = VGroup()
        for slope, intercept in [(0.5, 1), (1.2, 0.5), (0.3, 3)]:
            line = axes.plot(lambda x: slope * x + intercept, color=RED, x_range=[0, 10])
            bad_lines.add(line)
        
        self.play(Create(bad_lines), run_time=0.8)
        
        # Show they're all wrong
        cross = Text("✗", font_size=64, color=RED)
        cross.next_to(problem_text, DOWN)
        self.play(Write(cross), run_time=0.3)
        
        # Clear bad lines and cross
        self.play(FadeOut(bad_lines), FadeOut(cross), run_time=0.5)
        
        # Show the solution
        solution_text = Text("Linear regression finds the BEST line!", font_size=32, color=GREEN)
        solution_text.to_edge(UP)
        self.play(Transform(problem_text, solution_text), run_time=0.8)
        
        # Show the perfect line appearing
        best_line = axes.plot(lambda x: 0.75 * x + 1.5, color=GREEN, stroke_width=6, x_range=[0, 10])
        self.play(Create(best_line), run_time=1.0)
        
        # Show error lines (residuals) briefly
        error_lines = VGroup()
        for x, y in data_points:
            predicted_y = 0.75 * x + 1.5
            if abs(y - predicted_y) > 0.1:  # Only show visible errors
                error_line = Line(
                    axes.coords_to_point(x, y),
                    axes.coords_to_point(x, predicted_y),
                    color=ORANGE,
                    stroke_width=3
                )
                error_lines.add(error_line)
        
        self.play(Create(error_lines), run_time=0.8)
        
        # Final message
        final_text = Text("Minimizes total error!", font_size=28, color=ORANGE)
        final_text.next_to(axes, DOWN)
        self.play(Write(final_text), run_time=0.8)
        
        # Hold the final frame briefly
        self.wait(0.8)
        
        # Fade everything out to black
        self.play(
            FadeOut(axes),
            FadeOut(dots),
            FadeOut(best_line),
            FadeOut(error_lines),
            FadeOut(problem_text),
            FadeOut(final_text),
            run_time=1.0
        )
        
        # Big "Try it yourself!" with visual elements
        big_title = Text("Try it yourself!", font_size=72, color=BLUE)
        big_title.move_to(ORIGIN + UP * 0.5)
        
        # Subtitle
        subtitle = Text("Practice with the interactive demo below", font_size=32, color=WHITE)
        subtitle.next_to(big_title, DOWN, buff=0.8)
        
        # Add some simple decorative dots
        dot_left = Dot(color=YELLOW, radius=0.15)
        dot_left.next_to(big_title, LEFT, buff=1.0)
        
        dot_right = Dot(color=YELLOW, radius=0.15)
        dot_right.next_to(big_title, RIGHT, buff=1.0)
        
        # Show the ending with a nice animation
        self.play(
            Write(big_title),
            Create(dot_left),
            Create(dot_right),
            run_time=1.2
        )
        
        self.play(Write(subtitle), run_time=0.8)
        self.wait(1.5)

class LinearRegressionStory(Scene):
    def construct(self):
        # Alternative version with a story approach
        
        # Story setup
        story_text = Text("Imagine predicting house prices...", font_size=36, color=BLUE)
        self.play(Write(story_text), run_time=1.0)
        self.wait(0.5)
        self.play(FadeOut(story_text), run_time=0.5)
        
        # Create axes with labels
        axes = Axes(
            x_range=[0, 10, 2],
            y_range=[0, 10, 2],
            x_length=8,
            y_length=5,
            axis_config={"color": BLUE_C},
            tips=False,
        )
        
        # Add axis labels
        x_label = axes.get_x_axis_label("House Size (1000 sq ft)")
        y_label = axes.get_y_axis_label("Price ($100k)")
        
        self.play(Create(axes), Write(x_label), Write(y_label), run_time=1.0)
        
        # Show data points with story
        data_points = [(1, 2), (2, 3), (3, 4.5), (4, 5), (5, 6.5), (6, 7), (7, 8), (8, 9)]
        
        dots = VGroup()
        for i, (x, y) in enumerate(data_points):
            dot = Dot(axes.coords_to_point(x, y), color=YELLOW, radius=0.12)
            dots.add(dot)
            
        # Show dots appearing as "sales data"
        sales_text = Text("Recent house sales", font_size=24, color=YELLOW)
        sales_text.to_edge(UP)
        
        self.play(Write(sales_text), run_time=0.5)
        self.play(AnimationGroup(*[Create(dot) for dot in dots], lag_ratio=0.15), run_time=1.5)
        
        # The question
        question_text = Text("What would a 5.5k sq ft house cost?", font_size=28, color=RED)
        question_text.to_edge(UP)
        self.play(Transform(sales_text, question_text), run_time=0.8)
        
        # Show question mark at x=5.5
        question_dot = Dot(axes.coords_to_point(5.5, 5), color=RED, radius=0.15)
        question_mark = Text("?", font_size=32, color=RED)
        question_mark.next_to(question_dot, UP)
        
        self.play(Create(question_dot), Write(question_mark), run_time=0.8)
        
        # Linear regression to the rescue!
        answer_text = Text("Linear regression gives us the answer!", font_size=28, color=GREEN)
        answer_text.to_edge(UP)
        self.play(Transform(sales_text, answer_text), run_time=0.8)
        
        # Show the line
        best_line = axes.plot(lambda x: 0.8 * x + 1.2, color=GREEN, stroke_width=6, x_range=[0, 10])
        self.play(Create(best_line), run_time=1.0)
        
        # Show the prediction
        predicted_y = 0.8 * 5.5 + 1.2
        prediction_dot = Dot(axes.coords_to_point(5.5, predicted_y), color=GREEN, radius=0.15)
        price_text = Text(f"${predicted_y*100:.0f}k", font_size=24, color=GREEN)
        price_text.next_to(prediction_dot, UP)
        
        self.play(
            FadeOut(question_mark),
            Transform(question_dot, prediction_dot),
            Write(price_text),
            run_time=1.0
        )
        
        # Final message
        final_text = Text("The line that best fits all data points!", font_size=28, color=GREEN)
        final_text.to_edge(DOWN)
        self.play(Write(final_text), run_time=1.0)
        
        self.wait(2.0) 