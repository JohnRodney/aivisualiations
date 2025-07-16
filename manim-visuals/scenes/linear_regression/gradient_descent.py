from manim import (
    Scene, Text, VGroup, Axes, Dot, Line, Arrow,
    Write, FadeOut, Create, Transform,
    BLUE, WHITE, RED, GREEN, YELLOW, ORANGE,
    DOWN, UP, LEFT, RIGHT, ORIGIN
)
import numpy as np

class GradientDescentIntro(Scene):
    def construct(self):
        # Title
        title = Text("Gradient Descent", font_size=48, color=BLUE)
        subtitle = Text("How machines learn to find the best line", font_size=32, color=WHITE)
        title.to_edge(UP)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(2)
        
        # Clear title for visualization
        self.play(FadeOut(title), FadeOut(subtitle))
        
        # Create coordinate system
        axes = Axes(
            x_range=[-2, 2, 1],
            y_range=[-1, 3, 1],
            x_length=8,
            y_length=6,
            axis_config={"color": BLUE},
            x_axis_config={"numbers_to_show": np.arange(-2, 3, 1)},
            y_axis_config={"numbers_to_show": np.arange(-1, 4, 1)},
        )
        
        # Loss function (parabola)
        def loss_function(x):
            return (x - 0.5)**2 + 0.2
        
        loss_curve = axes.plot(loss_function, color=RED, x_range=[-2, 2])
        
        # Labels
        axes_labels = axes.get_axis_labels(x_label="Parameter", y_label="Loss")
        
        self.play(Create(axes), Write(axes_labels))
        self.play(Create(loss_curve))
        
        # Show the concept
        concept_text = Text("The Loss Landscape", font_size=24, color=YELLOW)
        concept_text.to_edge(UP)
        self.play(Write(concept_text))
        self.wait(2)
        
        # Starting point
        start_x = -1.5
        start_y = loss_function(start_x)
        start_point = axes.coords_to_point(start_x, start_y)
        
        dot = Dot(start_point, color=YELLOW, radius=0.1)
        self.play(Create(dot))
        
        # Gradient descent steps
        current_x = start_x
        learning_rate = 0.3
        
        for i in range(8):
            # Calculate gradient (derivative)
            gradient = 2 * (current_x - 0.5)
            
            # Update parameter
            new_x = current_x - learning_rate * gradient
            new_y = loss_function(new_x)
            new_point = axes.coords_to_point(new_x, new_y)
            
            # Show gradient arrow
            current_point = axes.coords_to_point(current_x, loss_function(current_x))
            gradient_arrow = Arrow(
                current_point,
                current_point + LEFT * gradient * 0.5,
                color=GREEN,
                buff=0
            )
            
            # Step arrow
            step_arrow = Arrow(
                current_point,
                new_point,
                color=ORANGE,
                buff=0
            )
            
            self.play(Create(gradient_arrow))
            self.wait(0.5)
            self.play(Create(step_arrow))
            self.play(dot.animate.move_to(new_point))
            self.play(FadeOut(gradient_arrow), FadeOut(step_arrow))
            
            current_x = new_x
            
            if abs(gradient) < 0.1:
                break
        
        # Final message
        final_text = Text("Minimum Found!", font_size=36, color=GREEN)
        final_text.to_edge(UP)
        self.play(Transform(concept_text, final_text))
        self.wait(2)

class LinearRegressionVisualization(Scene):
    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[0, 10, 1],
            x_length=8,
            y_length=6,
            axis_config={"color": BLUE},
        )
        
        # Data points
        data_points = [
            (1, 2), (2, 3), (3, 5), (4, 4), (5, 6), (6, 7), (7, 8), (8, 9)
        ]
        
        dots = VGroup(*[
            Dot(axes.coords_to_point(x, y), color=YELLOW, radius=0.08)
            for x, y in data_points
        ])
        
        self.play(Create(axes))
        self.play(Create(dots))
        
        # Show multiple possible lines
        lines = VGroup()
        for slope in [0.5, 1.0, 1.5]:
            line = axes.plot(lambda x: slope * x, color=RED, x_range=[0, 10])
            lines.add(line)
        
        self.play(Create(lines))
        self.wait(1)
        
        # Fade out wrong lines and show the best fit
        best_line = axes.plot(lambda x: 0.9 * x + 1.2, color=GREEN, x_range=[0, 10])
        self.play(FadeOut(lines), Create(best_line))
        
        # Show error lines
        error_lines = VGroup()
        for x, y in data_points:
            predicted_y = 0.9 * x + 1.2
            error_line = Line(
                axes.coords_to_point(x, y),
                axes.coords_to_point(x, predicted_y),
                color=ORANGE
            )
            error_lines.add(error_line)
        
        self.play(Create(error_lines))
        self.wait(2)
        
        # Title
        title = Text("Linear Regression: Finding the Best Fit", font_size=28, color=WHITE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(2) 