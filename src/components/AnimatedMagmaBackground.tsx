import { useEffect, useRef } from 'react';

const AnimatedMagmaBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Устанавливаем размер canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Отслеживаем движение мыши
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Отслеживаем скролл
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    window.addEventListener('mousemove', handleMouseMove);

    // Параметры магмы
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      maxLife: number;
      type: 'magma' | 'smoke';
    }> = [];

    // Цвета магмы с преобладанием красных-оранжевых-черных
    const magmaColors = [
      '#ff0000', // чистый красный
      '#ff4500', // яркий оранжево-красный
      '#ff6347', // томатный
      '#ff8c00', // темно-оранжевый
      '#ffa500', // оранжевый
      '#ff6b35', // красно-оранжевый
      '#dc143c', // малиновый
      '#b22222', // огненно-красный
      '#8B0000', // темно-красный
      '#2F0000', // очень темно-красный
      '#1a0000', // почти черный
      '#000000', // черный
    ];

    const smokeColors = [
      '#2F0000', // очень темно-красный
      '#1a0000', // почти черный
      '#000000', // черный
      '#1a1a1a', // темно-серый
      '#8B0000', // темно-красный
    ];

    // Создаем частицы магмы
    const MAX_PARTICLES = 40;
    const createParticles = () => {
      const toAdd = MAX_PARTICLES - particles.length;
      if (toAdd <= 0) return;
      for (let i = 0; i < toAdd; i++) {
        const isSmoke = Math.random() > 0.6;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 1 - 0.5,
          size: isSmoke ? Math.random() * 80 + 60 : Math.random() * 60 + 30,
          color: isSmoke 
            ? smokeColors[Math.floor(Math.random() * smokeColors.length)]
            : magmaColors[Math.floor(Math.random() * magmaColors.length)],
          life: 0,
          maxLife: Math.random() * 120 + 80,
          type: isSmoke ? 'smoke' : 'magma'
        });
      }
    };

    // Анимация
    const animate = () => {
      // Очищаем canvas с меньшей прозрачностью для более яркого эффекта
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Обновляем и рисуем частицы
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Реакция на движение мыши
        const mouseDistance = Math.sqrt(
          Math.pow(particle.x - mouseRef.current.x, 2) + 
          Math.pow(particle.y - mouseRef.current.y, 2)
        );
        
        if (mouseDistance < 260) {
          const force = (260 - mouseDistance) / 260;
          const angle = Math.atan2(particle.y - mouseRef.current.y, particle.x - mouseRef.current.x);
          // Очень мягкое отталкивание рядом с курсором
          const push = mouseDistance < 60 ? 0.04 : 0.01;
          particle.vx += Math.cos(angle) * force * push;
          particle.vy += Math.sin(angle) * force * push;
        }

        // Реакция на скролл: смещаем частицы по вертикали в зависимости от scrollY
        particle.y += scrollY * 0.01;

        // Обновляем позицию
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Добавляем более активное случайное движение
        particle.vx += (Math.random() - 0.5) * 0.08;
        particle.vy += (Math.random() - 0.5) * 0.05;

        // Ограничиваем скорость
        particle.vx = Math.max(-3, Math.min(3, particle.vx));
        particle.vy = Math.max(-3, Math.min(3, particle.vy));

        // Рисуем частицу с размытым радиальным градиентом
        const alpha = 1 - (particle.life / particle.maxLife);
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        // Сильная размытость: центр — очень прозрачный, промежуточный — почти прозрачный, край — полностью прозрачный
        const centerAlpha = Math.floor(alpha * 80 + 30).toString(16).padStart(2, '0'); // очень прозрачный
        const midAlpha = Math.floor(alpha * 30 + 10).toString(16).padStart(2, '0'); // почти прозрачный
        gradient.addColorStop(0, `${particle.color}${centerAlpha}`);
        gradient.addColorStop(0.4, `${particle.color}${midAlpha}`);
        gradient.addColorStop(1, `${particle.color}00`);
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Удаляем старые частицы
        if (particle.life > particle.maxLife || particle.y < -particle.size) {
          particles.splice(i, 1);
        }
      }

      // Добавляем новые частицы только если их меньше MAX_PARTICLES
      createParticles();

      requestAnimationFrame(animate);
    };

    // Запускаем анимацию
    createParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        filter: 'blur(3px)', // Уменьшил блюр с 8px до 3px
        opacity: 0.95, // Увеличил непрозрачность с 0.9 до 0.95
      }}
    />
  );
};

export default AnimatedMagmaBackground; 