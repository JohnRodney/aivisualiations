from manim import (
    Scene, Text, VGroup, Axes, Dot, Line, MathTex, 
    FadeIn, FadeOut, Write, Transform, Create, 
    RIGHT, LEFT, UP, DOWN, ORIGIN, PI,
    BLUE, RED, GREEN, YELLOW, ORANGE, WHITE, PURPLE,
    ValueTracker, DecimalNumber, always_redraw,
    Arrow, Rectangle, Polygon, Circle,
    AnimationGroup, LaggedStart, Wait
)
import numpy as np

class SlopeInterceptMagic(Scene):
    def construct(self):
        # Title sequence
        title = Text("Slope & Intercept Magic", font_size=72, color=BLUE)
        subtitle = Text("Understanding y = mx + b", font_size=36, color=WHITE)
        subtitle.next_to(title, DOWN, buff=0.5)
        
        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))
        
        # Setup axes
        axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            x_length=8,
            y_length=6,
            axis_config={"color": WHITE, "include_numbers": True},
        )
        axes_labels = axes.get_axis_labels(x_label="x", y_label="y")
        
        self.play(Create(axes), Write(axes_labels))
        self.wait(1)
        
        # Show the fundamental equation
        equation = MathTex(r"y = mx + b", font_size=60, color=YELLOW)
        equation.to_edge(UP)
        
        self.play(Write(equation))
        self.wait(1)
        
        # Explain each component
        m_highlight = MathTex(r"y = ", r"m", r"x + b", font_size=60)
        m_highlight[1].set_color(RED)
        m_highlight.move_to(equation)
        
        slope_text = Text("m = slope (steepness)", font_size=32, color=RED)
        slope_text.next_to(equation, DOWN, buff=0.5)
        
        self.play(Transform(equation, m_highlight))
        self.play(Write(slope_text))
        self.wait(2)
        
        # Highlight b
        b_highlight = MathTex(r"y = mx + ", r"b", font_size=60)
        b_highlight[1].set_color(GREEN)
        b_highlight.move_to(equation)
        
        intercept_text = Text("b = y-intercept (where line crosses y-axis)", font_size=32, color=GREEN)
        intercept_text.next_to(slope_text, DOWN, buff=0.3)
        
        self.play(Transform(equation, b_highlight))
        self.play(Write(intercept_text))
        self.wait(2)
        
        # Clear explanatory text
        self.play(FadeOut(slope_text, intercept_text))
        
        # Reset equation
        equation_reset = MathTex(r"y = mx + b", font_size=60, color=YELLOW)
        equation_reset.to_edge(UP)
        self.play(Transform(equation, equation_reset))
        
        # PART 1: Understanding Slope (m)
        section1 = Text("Part 1: The Magic of Slope (m)", font_size=48, color=BLUE)
        section1.move_to(ORIGIN)
        
        self.play(Write(section1))
        self.wait(1.5)
        self.play(FadeOut(section1))
        
        # Create slope tracker and line
        slope_tracker = ValueTracker(1)
        intercept_tracker = ValueTracker(0)
        
        # Display current values
        slope_display = VGroup(
            Text("m = ", font_size=32, color=RED),
            DecimalNumber(1, num_decimal_places=1, color=RED, font_size=32)
        ).arrange(RIGHT)
        slope_display.to_edge(RIGHT, buff=1).shift(UP * 2)
        
        intercept_display = VGroup(
            Text("b = ", font_size=32, color=GREEN),
            DecimalNumber(0, num_decimal_places=1, color=GREEN, font_size=32)
        ).arrange(RIGHT)
        intercept_display.next_to(slope_display, DOWN, buff=0.5)
        
        def update_slope_display(mob):
            mob[1].set_value(slope_tracker.get_value())
            
        def update_intercept_display(mob):
            mob[1].set_value(intercept_tracker.get_value())
            
        slope_display.add_updater(update_slope_display)
        intercept_display.add_updater(update_intercept_display)
        
        self.play(Write(slope_display), Write(intercept_display))
        
        # Create dynamic line
        def get_line():
            m = slope_tracker.get_value()
            b = intercept_tracker.get_value()
            
            # Calculate line endpoints
            x_start = -4
            x_end = 4
            y_start = m * x_start + b
            y_end = m * x_end + b
            
            # Clamp y values to visible range
            y_start = max(-4.5, min(4.5, y_start))
            y_end = max(-4.5, min(4.5, y_end))
            
            start_point = axes.c2p(x_start, y_start)
            end_point = axes.c2p(x_end, y_end)
            
            return Line(start_point, end_point, color=BLUE, stroke_width=4)
        
        line = always_redraw(get_line)
        self.play(Create(line))
        
        # Show y-intercept dot
        def get_y_intercept_dot():
            b = intercept_tracker.get_value()
            point = axes.c2p(0, b)
            return Dot(point, color=GREEN, radius=0.08)
        
        y_intercept_dot = always_redraw(get_y_intercept_dot)
        self.play(Create(y_intercept_dot))
        
        # Demonstrate different slopes
        slope_demo_text = Text("Watch how slope changes the line!", font_size=32, color=WHITE)
        slope_demo_text.to_edge(LEFT, buff=1).shift(DOWN * 2)
        self.play(Write(slope_demo_text))
        
        # Positive slope increase
        self.play(slope_tracker.animate.set_value(2), run_time=2)
        self.wait(0.5)
        self.play(slope_tracker.animate.set_value(3), run_time=2)
        self.wait(0.5)
        
        # Negative slope
        self.play(slope_tracker.animate.set_value(-1), run_time=2)
        self.wait(0.5)
        self.play(slope_tracker.animate.set_value(-2), run_time=2)
        self.wait(0.5)
        
        # Zero slope (horizontal line)
        self.play(slope_tracker.animate.set_value(0), run_time=2)
        self.wait(1)
        
        # Steep positive slope
        self.play(slope_tracker.animate.set_value(5), run_time=2)
        self.wait(1)
        
        # Reset to normal slope
        self.play(slope_tracker.animate.set_value(1), run_time=1)
        self.play(FadeOut(slope_demo_text))
        
        # PART 2: Understanding Y-Intercept (b)
        section2 = Text("Part 2: The Magic of Y-Intercept (b)", font_size=48, color=GREEN)
        section2.move_to(ORIGIN)
        
        self.play(Write(section2))
        self.wait(1.5)
        self.play(FadeOut(section2))
        
        # Demonstrate y-intercept
        intercept_demo_text = Text("Y-intercept moves the line up and down!", font_size=32, color=WHITE)
        intercept_demo_text.to_edge(LEFT, buff=1).shift(DOWN * 2)
        self.play(Write(intercept_demo_text))
        
        # Move y-intercept up
        self.play(intercept_tracker.animate.set_value(2), run_time=2)
        self.wait(0.5)
        self.play(intercept_tracker.animate.set_value(3), run_time=2)
        self.wait(0.5)
        
        # Move y-intercept down
        self.play(intercept_tracker.animate.set_value(-1), run_time=2)
        self.wait(0.5)
        self.play(intercept_tracker.animate.set_value(-3), run_time=2)
        self.wait(0.5)
        
        # Reset to zero
        self.play(intercept_tracker.animate.set_value(0), run_time=2)
        self.play(FadeOut(intercept_demo_text))
        
        # PART 3: The Power of Small Changes
        section3 = Text("Part 3: Small Changes, Big Impact!", font_size=48, color=ORANGE)
        section3.move_to(ORIGIN)
        
        self.play(Write(section3))
        self.wait(1.5)
        self.play(FadeOut(section3))
        
        # Show two points for prediction
        point1 = Dot(axes.coords_to_point(1, 1), color=YELLOW, radius=0.1)
        point2 = Dot(axes.coords_to_point(4, 4), color=YELLOW, radius=0.1)
        
        point1_label = Text("Close prediction", font_size=24, color=YELLOW)
        point1_label.next_to(point1, UP, buff=0.1)
        
        point2_label = Text("Far prediction", font_size=24, color=YELLOW)
        point2_label.next_to(point2, UP, buff=0.1)
        
        self.play(Create(point1), Create(point2))
        self.play(Write(point1_label), Write(point2_label))
        
        # Show impact of small slope change
        impact_text = Text("Small slope change = BIG difference far away!", font_size=32, color=ORANGE)
        impact_text.to_edge(LEFT, buff=1).shift(DOWN * 2)
        self.play(Write(impact_text))
        
        # Show line with slope 1
        self.play(slope_tracker.animate.set_value(1), run_time=1)
        self.wait(1)
        
        # Small change to slope 1.2
        self.play(slope_tracker.animate.set_value(1.2), run_time=2)
        self.wait(2)
        
        # Back to 1
        self.play(slope_tracker.animate.set_value(1), run_time=1)
        self.wait(1)
        
        # Even smaller change to 0.8
        self.play(slope_tracker.animate.set_value(0.8), run_time=2)
        self.wait(2)
        
        self.play(FadeOut(impact_text, point1, point2, point1_label, point2_label))
        
        # PART 4: Real-world examples
        section4 = Text("Part 4: Real-World Examples", font_size=48, color=PURPLE)
        section4.move_to(ORIGIN)
        
        self.play(Write(section4))
        self.wait(1.5)
        self.play(FadeOut(section4))
        
        # Example 1: Temperature conversion
        example1 = VGroup(
            Text("Example 1: Temperature Conversion", font_size=36, color=BLUE),
            Text("°F = 1.8 × °C + 32", font_size=32, color=WHITE),
            Text("Slope: 1.8 (conversion factor)", font_size=24, color=RED),
            Text("Y-intercept: 32 (freezing point offset)", font_size=24, color=GREEN)
        ).arrange(DOWN, buff=0.3)
        example1.to_edge(LEFT, buff=1).shift(DOWN * 1)
        
        self.play(slope_tracker.animate.set_value(1.8), run_time=1)
        self.play(intercept_tracker.animate.set_value(32/10), run_time=1)  # Scale down for visibility
        self.play(Write(example1))
        self.wait(3)
        self.play(FadeOut(example1))
        
        # Example 2: Salary calculation
        example2 = VGroup(
            Text("Example 2: Salary Calculation", font_size=36, color=BLUE),
            Text("Pay = $25 × hours + $0", font_size=32, color=WHITE),
            Text("Slope: $25/hour (hourly rate)", font_size=24, color=RED),
            Text("Y-intercept: $0 (no base salary)", font_size=24, color=GREEN)
        ).arrange(DOWN, buff=0.3)
        example2.to_edge(LEFT, buff=1).shift(DOWN * 1)
        
        self.play(slope_tracker.animate.set_value(2.5), run_time=1)  # Scale down for visibility
        self.play(intercept_tracker.animate.set_value(0), run_time=1)
        self.play(Write(example2))
        self.wait(3)
        self.play(FadeOut(example2))
        
        # Clean up displays
        slope_display.remove_updater(update_slope_display)
        intercept_display.remove_updater(update_intercept_display)
        
        # Final summary
        self.play(FadeOut(axes, axes_labels, line, y_intercept_dot, slope_display, intercept_display))
        
        # Key takeaways
        takeaway_title = Text("Key Takeaways", font_size=48, color=YELLOW)
        takeaway_title.to_edge(UP)
        
        takeaways = VGroup(
            Text("✓ Slope (m) controls steepness and direction", font_size=32, color=RED),
            Text("✓ Y-intercept (b) is where the line crosses y-axis", font_size=32, color=GREEN),
            Text("✓ Small slope changes = BIG impact on predictions", font_size=32, color=ORANGE),
            Text("✓ y = mx + b describes every straight line!", font_size=32, color=BLUE)
        ).arrange(DOWN, buff=0.5, aligned_edge=LEFT)
        takeaways.center()
        
        self.play(Write(takeaway_title))
        self.play(LaggedStart(*[Write(takeaway) for takeaway in takeaways], lag_ratio=0.5))
        self.wait(2)
        
        # Final equation emphasis
        final_equation = MathTex(r"y = mx + b", font_size=80, color=YELLOW)
        final_equation.next_to(takeaways, DOWN, buff=1)
        
        self.play(Write(final_equation))
        self.wait(1)
        
        # Ending message
        ending = Text("Now you understand the magic! 🪄", font_size=36, color=WHITE)
        ending.next_to(final_equation, DOWN, buff=0.5)
        
        self.play(Write(ending))
        self.wait(3)
        
        # Fade out everything
        self.play(FadeOut(*self.mobjects))
        self.wait(1) 