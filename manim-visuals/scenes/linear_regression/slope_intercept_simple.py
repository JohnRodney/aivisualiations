from manim import (
    Scene, Text, VGroup, Axes, Dot, Line, 
    FadeIn, FadeOut, Write, Transform, Create, 
    RIGHT, LEFT, UP, DOWN, ORIGIN,
    BLUE, RED, GREEN, YELLOW, ORANGE, WHITE, PURPLE,
    ValueTracker, always_redraw,
    LaggedStart, Wait
)
import numpy as np

class SlopeInterceptSimple(Scene):
    def construct(self):
        # Title sequence
        title = Text("Slope & Intercept Magic", font_size=72, color=BLUE)
        subtitle = Text("Understanding y = mx + b", font_size=36, color=WHITE)
        subtitle.next_to(title, DOWN, buff=0.5)
        
        self.play(Write(title))
        self.play(Write(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))
        
        # Setup simple axes without numbers to avoid LaTeX issues
        axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            x_length=8,
            y_length=6,
            axis_config={"color": WHITE, "include_numbers": False},
        )
        
        # Manual axis labels (don't show initially)
        x_label = Text("x", font_size=32, color=WHITE)
        y_label = Text("y", font_size=32, color=WHITE)
        x_label.next_to(axes.x_axis.get_end(), RIGHT, buff=0.1)
        y_label.next_to(axes.y_axis.get_end(), UP, buff=0.1)
        
        # Show axes first (without labels)
        self.play(Create(axes))
        self.wait(1)
        
        # Show the fundamental equation using Text - TOP LEFT and smaller
        equation = Text("y = mx + b", font_size=40, color=YELLOW)
        equation.to_edge(UP + LEFT, buff=0.5)
        
        self.play(Write(equation))
        self.wait(1)
        
        # Explain each component
        slope_text = Text("m = slope (steepness)", font_size=28, color=RED)
        slope_text.next_to(equation, DOWN, buff=0.3).align_to(equation, LEFT)
        
        self.play(Write(slope_text))
        self.wait(2)
        
        intercept_text = Text("b = y-intercept (where line crosses y-axis)", font_size=28, color=GREEN)
        intercept_text.next_to(slope_text, DOWN, buff=0.3).align_to(equation, LEFT)
        
        self.play(Write(intercept_text))
        self.wait(2)
        
        # Clear explanatory text
        self.play(FadeOut(slope_text, intercept_text))
        
        # PART 1: Understanding Slope (m)
        section1 = Text("Part 1: The Magic of Slope (m)", font_size=48, color=BLUE)
        section1.move_to(ORIGIN)
        
        # Fade out grid for section intro
        self.play(FadeOut(axes), Write(section1))
        self.wait(1.5)
        self.play(FadeOut(section1), FadeIn(axes))
        
        # NOW show axis labels with the line
        self.play(Write(x_label), Write(y_label))
        
        # Create slope tracker and line
        slope_tracker = ValueTracker(1)
        intercept_tracker = ValueTracker(0)
        
        # Display current values - positioned better
        slope_display = Text("m = 1.0", font_size=28, color=RED)
        slope_display.to_edge(RIGHT, buff=1).shift(UP * 2)
        
        intercept_display = Text("b = 0.0", font_size=28, color=GREEN)
        intercept_display.next_to(slope_display, DOWN, buff=0.5)
        
        def update_slope_display(mob):
            mob.become(Text(f"m = {slope_tracker.get_value():.1f}", font_size=28, color=RED))
            mob.to_edge(RIGHT, buff=1).shift(UP * 2)
            
        def update_intercept_display(mob):
            mob.become(Text(f"b = {intercept_tracker.get_value():.1f}", font_size=28, color=GREEN))
            mob.next_to(slope_display, DOWN, buff=0.5)
            
        slope_display.add_updater(update_slope_display)
        intercept_display.add_updater(update_intercept_display)
        
        self.play(Write(slope_display), Write(intercept_display))
        
        # Create dynamic line
        def get_line():
            m = slope_tracker.get_value()
            b = intercept_tracker.get_value()
            
            # Calculate line endpoints that maintain correct slope
            # Find where line intersects the visible boundaries
            x_min, x_max = -4.5, 4.5
            y_min, y_max = -4.5, 4.5
            
            # Calculate y-values at x boundaries
            y_at_x_min = m * x_min + b
            y_at_x_max = m * x_max + b
            
            # Find intersections with y boundaries (if line is steep)
            if m != 0:
                x_at_y_min = (y_min - b) / m
                x_at_y_max = (y_max - b) / m
            else:
                x_at_y_min = x_min
                x_at_y_max = x_max
            
            # Collect all intersection points
            intersections = []
            
            # Check intersection with left boundary
            if y_min <= y_at_x_min <= y_max:
                intersections.append((x_min, y_at_x_min))
            
            # Check intersection with right boundary  
            if y_min <= y_at_x_max <= y_max:
                intersections.append((x_max, y_at_x_max))
                
            # Check intersection with bottom boundary
            if x_min <= x_at_y_min <= x_max:
                intersections.append((x_at_y_min, y_min))
                
            # Check intersection with top boundary
            if x_min <= x_at_y_max <= x_max:
                intersections.append((x_at_y_max, y_max))
            
            # Remove duplicates and sort
            intersections = list(set(intersections))
            
            # If we have at least 2 intersections, use the extreme ones
            if len(intersections) >= 2:
                intersections.sort(key=lambda p: p[0])  # Sort by x-coordinate
                start_point = axes.c2p(intersections[0][0], intersections[0][1])
                end_point = axes.c2p(intersections[-1][0], intersections[-1][1])
            else:
                # Fallback to extended line (shouldn't happen with proper math)
                start_point = axes.c2p(x_min, y_at_x_min)
                end_point = axes.c2p(x_max, y_at_x_max)
            
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
        
        # Demonstrate different slopes - text at BOTTOM LEFT
        slope_demo_text = Text("Watch how slope changes the line!", font_size=32, color=WHITE)
        slope_demo_text.to_edge(DOWN + LEFT, buff=0.5)
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
        
        # Fade out grid AND line for better readability
        self.play(FadeOut(axes, x_label, y_label, line, y_intercept_dot), Write(section2))
        self.wait(1.5)
        self.play(FadeOut(section2), FadeIn(axes, x_label, y_label, line, y_intercept_dot))
        
        # Demonstrate y-intercept - text at BOTTOM LEFT
        intercept_demo_text = Text("Y-intercept moves the line up and down!", font_size=32, color=WHITE)
        intercept_demo_text.to_edge(DOWN + LEFT, buff=0.5)
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
        
        # Fade out grid AND line for section intro
        self.play(FadeOut(axes, x_label, y_label, line, y_intercept_dot), Write(section3))
        self.wait(1.5)
        self.play(FadeOut(section3), FadeIn(axes, x_label, y_label, line, y_intercept_dot))
        
        # Show two points for prediction
        point1 = Dot(axes.c2p(1, 1), color=YELLOW, radius=0.1)
        point2 = Dot(axes.c2p(4, 4), color=YELLOW, radius=0.1)
        
        point1_label = Text("Close prediction", font_size=24, color=YELLOW)
        point1_label.next_to(point1, UP, buff=0.1)
        
        point2_label = Text("Far prediction", font_size=24, color=YELLOW)
        point2_label.next_to(point2, UP, buff=0.1)
        
        self.play(Create(point1), Create(point2))
        self.play(Write(point1_label), Write(point2_label))
        
        # Show impact of small slope change - text at BOTTOM LEFT
        impact_text = Text("Small slope change = BIG difference far away!", font_size=32, color=ORANGE)
        impact_text.to_edge(DOWN + LEFT, buff=0.5)
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
        
        # Clean up displays
        slope_display.remove_updater(update_slope_display)
        intercept_display.remove_updater(update_intercept_display)
        
        # Final summary
        self.play(FadeOut(axes, x_label, y_label, line, y_intercept_dot, slope_display, intercept_display))
        
        # Key takeaways
        takeaway_title = Text("Key Takeaways", font_size=48, color=YELLOW)
        takeaway_title.to_edge(UP)
        
        takeaways = VGroup(
            Text("• Slope (m) controls steepness and direction", font_size=32, color=RED),
            Text("• Y-intercept (b) is where the line crosses y-axis", font_size=32, color=GREEN),
            Text("• Small slope changes = BIG impact on predictions", font_size=32, color=ORANGE),
            Text("• y = mx + b describes every straight line!", font_size=32, color=BLUE)
        ).arrange(DOWN, buff=0.5, aligned_edge=LEFT)
        takeaways.center()
        
        self.play(Write(takeaway_title))
        self.play(LaggedStart(*[Write(takeaway) for takeaway in takeaways], lag_ratio=0.5))
        self.wait(2)
        
        # Final equation emphasis
        final_equation = Text("y = mx + b", font_size=80, color=YELLOW)
        final_equation.next_to(takeaways, DOWN, buff=1)
        
        self.play(Write(final_equation))
        self.wait(1)
        
        # Ending message
        ending = Text("Now you understand the magic! ✨", font_size=36, color=WHITE)
        ending.next_to(final_equation, DOWN, buff=0.5)
        
        self.play(Write(ending))
        self.wait(3)
        
        # Fade out everything
        self.play(FadeOut(*self.mobjects))
        self.wait(1) 