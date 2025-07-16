from manim import (
    Scene, Text, VGroup, Axes, Dot, Circle, ThreeDAxes, Surface,
    Write, FadeOut, Create, Transform,
    BLUE, WHITE, RED, GREEN, YELLOW, ORANGE, GRAY, PURPLE,
    UP, DOWN, LEFT, RIGHT
)
import numpy as np

class SVMIntroduction(Scene):
    def construct(self):
        title = Text("Support Vector Machine", font_size=48, color=BLUE)
        subtitle = Text("Finding the optimal decision boundary", font_size=32, color=WHITE)
        title.to_edge(UP)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(2)
        self.play(FadeOut(title), FadeOut(subtitle))
        
        # Create coordinate system
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-3, 3, 1],
            x_length=8,
            y_length=6,
            axis_config={"color": BLUE},
        )
        
        self.play(Create(axes))
        
        # Data points for two classes
        class_1_points = [(-1, -1), (-1.5, -0.5), (-2, -1.5), (-1, -2)]
        class_2_points = [(1, 1), (1.5, 0.5), (2, 1.5), (1, 2)]
        
        class_1_dots = VGroup(*[
            Dot(axes.coords_to_point(x, y), color=RED, radius=0.1)
            for x, y in class_1_points
        ])
        
        class_2_dots = VGroup(*[
            Dot(axes.coords_to_point(x, y), color=GREEN, radius=0.1)
            for x, y in class_2_points
        ])
        
        self.play(Create(class_1_dots), Create(class_2_dots))
        
        # Show multiple possible boundaries
        possible_lines = VGroup()
        for slope in [0.5, 1.0, 1.5]:
            line = axes.plot(lambda x: slope * x, color=GRAY, x_range=[-3, 3])
            possible_lines.add(line)
        
        self.play(Create(possible_lines))
        self.wait(1)
        
        # Fade out and show the optimal boundary
        optimal_line = axes.plot(lambda x: x, color=YELLOW, x_range=[-3, 3])
        self.play(FadeOut(possible_lines), Create(optimal_line))
        
        # Show margin lines
        margin_line_1 = axes.plot(lambda x: x - 1.5, color=ORANGE, x_range=[-3, 3])
        margin_line_2 = axes.plot(lambda x: x + 1.5, color=ORANGE, x_range=[-3, 3])
        
        self.play(Create(margin_line_1), Create(margin_line_2))
        
        # Highlight support vectors
        support_vectors = [
            Dot(axes.coords_to_point(-1, -1), color=RED, radius=0.15),
            Dot(axes.coords_to_point(1, 1), color=GREEN, radius=0.15),
        ]
        
        for sv in support_vectors:
            circle = Circle(radius=0.3, color=WHITE).move_to(sv.get_center())
            self.play(Create(circle))
            self.play(Transform(sv, Dot(sv.get_center(), color=sv.color, radius=0.15)))
        
        # Title
        final_title = Text("Support Vector Machine", font_size=28, color=WHITE)
        final_title.to_edge(UP)
        self.play(Write(final_title))
        self.wait(2)

class KernelTrick(Scene):
    def construct(self):
        title = Text("The Kernel Trick", font_size=48, color=PURPLE)
        subtitle = Text("Mapping data to higher dimensions", font_size=32, color=WHITE)
        title.to_edge(UP)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(2)
        self.play(FadeOut(title), FadeOut(subtitle))
        
        # 2D non-linearly separable data
        axes_2d = Axes(
            x_range=[-3, 3, 1],
            y_range=[-3, 3, 1],
            x_length=6,
            y_length=4,
            axis_config={"color": BLUE},
        ).shift(LEFT * 3)
        
        # Circular data distribution
        inner_points = [(0.5, 0), (0, 0.5), (-0.5, 0), (0, -0.5)]
        outer_points = [(2, 0), (0, 2), (-2, 0), (0, -2), (1.5, 1.5), (-1.5, 1.5)]
        
        inner_dots = VGroup(*[
            Dot(axes_2d.coords_to_point(x, y), color=RED, radius=0.08)
            for x, y in inner_points
        ])
        
        outer_dots = VGroup(*[
            Dot(axes_2d.coords_to_point(x, y), color=GREEN, radius=0.08)
            for x, y in outer_points
        ])
        
        self.play(Create(axes_2d))
        self.play(Create(inner_dots), Create(outer_dots))
        
        # Show that linear separation is impossible
        failed_line = axes_2d.plot(lambda x: 0.5 * x, color=GRAY, x_range=[-3, 3])
        self.play(Create(failed_line))
        self.wait(1)
        self.play(FadeOut(failed_line))
        
        # Transform to 3D
        axes_3d = ThreeDAxes(
            x_range=[-3, 3, 1],
            y_range=[-3, 3, 1],
            z_range=[0, 5, 1],
            x_length=6,
            y_length=4,
            z_length=3,
        ).shift(RIGHT * 3)
        
        # Map points to 3D using kernel function z = x^2 + y^2
        inner_dots_3d = VGroup(*[
            Dot(axes_3d.coords_to_point(x, y, x**2 + y**2), color=RED, radius=0.08)
            for x, y in inner_points
        ])
        
        outer_dots_3d = VGroup(*[
            Dot(axes_3d.coords_to_point(x, y, x**2 + y**2), color=GREEN, radius=0.08)
            for x, y in outer_points
        ])
        
        self.play(Create(axes_3d))
        self.play(Create(inner_dots_3d), Create(outer_dots_3d))
        
        # Show linear separation in 3D
        plane = Surface(
            lambda u, v: axes_3d.coords_to_point(u, v, 2),
            u_range=[-3, 3],
            v_range=[-3, 3],
            fill_color=YELLOW,
            fill_opacity=0.3
        )
        
        self.play(Create(plane))
        self.wait(2)
        
        # Title
        final_title = Text("Kernel Trick: Linear in Higher Dimensions", font_size=24, color=WHITE)
        final_title.to_edge(UP)
        self.play(Write(final_title))
        self.wait(2) 