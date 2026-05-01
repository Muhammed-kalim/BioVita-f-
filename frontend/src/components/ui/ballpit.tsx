import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface BallpitProps {
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  colors?: string[];
}

const Ballpit: React.FC<BallpitProps> = ({
  count = 100,
  gravity = 0.5,
  friction = 0.9975,
  wallBounce = 0.95,
  followCursor = true,
  colors = ["#5227FF", "#7cff67", "#ff6b6b"]
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } = Matter;

    const engine = Engine.create();
    engineRef.current = engine;
    engine.gravity.y = gravity;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        background: 'transparent',
        wireframes: false,
      }
    });

    const runner = Runner.create();

    // Walls
    const wallOptions = { isStatic: true, restitution: wallBounce, friction: 0 };
    const walls = [
      Bodies.rectangle(render.options.width / 2, -25, render.options.width, 50, wallOptions), // Top
      Bodies.rectangle(render.options.width / 2, render.options.height + 25, render.options.width, 50, wallOptions), // Bottom
      Bodies.rectangle(-25, render.options.height / 2, 50, render.options.height, wallOptions), // Left
      Bodies.rectangle(render.options.width + 25, render.options.height / 2, 50, render.options.height, wallOptions) // Right
    ];
    Composite.add(engine.world, walls);

    // Balls
    const balls = [];
    for (let i = 0; i < count; i++) {
        const radius = Math.random() * 15 + 10;
        const ball = Bodies.circle(
          Math.random() * render.options.width,
          Math.random() * render.options.height,
          radius,
          {
            restitution: wallBounce,
            friction: friction,
            render: {
              fillStyle: colors[Math.floor(Math.random() * colors.length)]
            }
          }
        );
        balls.push(ball);
    }
    Composite.add(engine.world, balls);

    // Mouse control
    if (followCursor) {
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2,
            render: {
              visible: false
            }
          }
        });
        Composite.add(engine.world, mouseConstraint);
        // keep the mouse in sync with rendering
        render.mouse = mouse;
    }

    Render.run(render);
    Runner.run(runner, engine);

    const handleResize = () => {
        if (!sceneRef.current) return;
        render.canvas.width = sceneRef.current.clientWidth;
        render.canvas.height = sceneRef.current.clientHeight;
        
        // Update walls positions
        Matter.Body.setPosition(walls[1], { x: render.canvas.width / 2, y: render.canvas.height + 25 });
        Matter.Body.setPosition(walls[3], { x: render.canvas.width + 25, y: render.canvas.height / 2 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [count, gravity, friction, wallBounce, followCursor, colors]);

  return (
    <div ref={sceneRef} className="w-full h-full absolute inset-0 overflow-hidden" />
  );
};

export default Ballpit;
