'use client'

// Three.js HeroCanvas — loaded dynamically with ssr: false from the landing page
// Renders an ambient particle field with slow drift and gold color palette

import { useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/utils'

// ── CANVAS INNER (actual Three.js code) ───────────────────────

function HeroCanvasInner({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (!mountRef.current) return
    if (reduced) return // Skip Three.js on reduced-motion

    let renderer: any, scene: any, camera: any, animId: number
    let particles: any, clock: any

    const init = async () => {
      const THREE = await import('three')

      // Scene
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(
        60,
        mountRef.current!.clientWidth / mountRef.current!.clientHeight,
        0.1,
        1000
      )
      camera.position.z = 80

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(mountRef.current!.clientWidth, mountRef.current!.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      mountRef.current!.appendChild(renderer.domElement)

      clock = new THREE.Clock()

      // Particles
      const PARTICLE_COUNT = 1800
      const positions = new Float32Array(PARTICLE_COUNT * 3)
      const colors = new Float32Array(PARTICLE_COUNT * 3)
      const sizes = new Float32Array(PARTICLE_COUNT)
      const velocities = new Float32Array(PARTICLE_COUNT * 3)

      const gold = new THREE.Color('#D4AF72')
      const blush = new THREE.Color('#F2B5C7')
      const white = new THREE.Color('#F8F4F0')

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3
        positions[i3] = (Math.random() - 0.5) * 200
        positions[i3 + 1] = (Math.random() - 0.5) * 120
        positions[i3 + 2] = (Math.random() - 0.5) * 100

        velocities[i3] = (Math.random() - 0.5) * 0.015
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.01 - 0.005 // slight downward drift
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.008

        const t = Math.random()
        const c = t < 0.5 ? gold.clone().lerp(white, t * 2) : gold.clone().lerp(blush, (t - 0.5) * 2)
        colors[i3] = c.r
        colors[i3 + 1] = c.g
        colors[i3 + 2] = c.b

        sizes[i] = Math.random() * 1.5 + 0.3
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const material = new THREE.PointsMaterial({
        size: 0.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })

      particles = new THREE.Points(geometry, material)
      scene.add(particles)

      // Ambient dim directional light (not needed for points but helps fog feel)
      scene.fog = new THREE.FogExp2(0x0a0a14, 0.008)

      // Mouse parallax
      let mouseX = 0, mouseY = 0
      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', onMouseMove)

      // Resize
      const onResize = () => {
        if (!mountRef.current) return
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
      }
      window.addEventListener('resize', onResize)

      // Animation loop
      const animate = () => {
        animId = requestAnimationFrame(animate)
        const delta = clock.getDelta()
        const elapsed = clock.getElapsedTime()

        const pos = particles.geometry.attributes.position
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3
          pos.array[i3] += velocities[i3]
          pos.array[i3 + 1] += velocities[i3 + 1]
          pos.array[i3 + 2] += velocities[i3 + 2]

          // Wrap around bounds
          if (pos.array[i3] > 100) pos.array[i3] = -100
          if (pos.array[i3] < -100) pos.array[i3] = 100
          if (pos.array[i3 + 1] > 60) pos.array[i3 + 1] = -60
          if (pos.array[i3 + 1] < -60) pos.array[i3 + 1] = 60
        }
        pos.needsUpdate = true

        // Subtle rotation + mouse parallax
        particles.rotation.y = elapsed * 0.015 + mouseX * 0.03
        particles.rotation.x = elapsed * 0.008 + mouseY * 0.02

        renderer.render(scene, camera)
      }

      animate()

      return () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(animId)
        renderer.dispose()
        geometry.dispose()
        material.dispose()
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement)
        }
      }
    }

    let cleanup: (() => void) | undefined
    init().then((fn) => { cleanup = fn })

    return () => cleanup?.()
  }, [reduced])

  // On reduced-motion, show a simple gradient background
  if (reduced) {
    return (
      <div
        className={cn('absolute inset-0', className)}
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(212,175,114,0.08) 0%, transparent 60%)',
        }}
      />
    )
  }

  return (
    <div
      ref={mountRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      aria-hidden="true"
    />
  )
}

// ── DYNAMIC EXPORT (no SSR) ───────────────────────────────────

export const HeroCanvas = dynamic(() => Promise.resolve(HeroCanvasInner), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse at 50% 60%, rgba(212,175,114,0.06) 0%, transparent 60%)',
      }}
    />
  ),
})

export default HeroCanvas
