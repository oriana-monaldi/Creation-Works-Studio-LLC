import { useEffect, useRef, useState } from 'react'
import type { Language } from '../data/content'

/** Three intertwined metallic ribbons represent Build, Automate and Grow. */
export function EcosystemScene({ active, language }: { active: number; language: Language }) {
  const host = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  const [state, setState] = useState<'loading' | 'ready' | 'fallback'>('loading')
  useEffect(() => { activeRef.current = active }, [active])
  useEffect(() => {
    const element = host.current
    if (!element) return
    let disposed = false
    let cleanup = () => {}
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const reduced = () => media.matches || document.documentElement.dataset.motion === 'reduced'
    const mobile = matchMedia('(max-width: 767px)').matches
    const coarse = matchMedia('(pointer: coarse)').matches
    let loadStarted = false
    const load = async () => {
      if (loadStarted || disposed) return
      loadStarted = true
      try {
        const [THREE, { RoomEnvironment }] = await Promise.all([
          import('three'), import('three/examples/jsm/environments/RoomEnvironment.js'),
        ])
        if (disposed) return
        let renderer: InstanceType<typeof THREE.WebGLRenderer>
        try {
          renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !mobile, powerPreference: mobile ? 'low-power' : 'high-performance' })
        } catch { setState('fallback'); return }
        renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.6))
        renderer.setClearColor(0x000000, 0)
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2
        renderer.domElement.setAttribute('aria-hidden', 'true')
        element.prepend(renderer.domElement)
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(35, 1, .1, 40)
        camera.position.set(0, .1, 8.3)
        const pmrem = new THREE.PMREMGenerator(renderer)
        const room = new RoomEnvironment()
        const environment = pmrem.fromScene(room, .04)
        scene.environment = environment.texture
        room.dispose(); pmrem.dispose()
        const sculpture = new THREE.Group()
        scene.add(sculpture)
        const uniforms = { time: { value: 0 }, pointer: { value: new THREE.Vector2() } }
        const colors = [0xdbb565, 0xeee0ba, 0xa48245]
        const materials = colors.map(color => {
          const material = new THREE.MeshPhysicalMaterial({ color, metalness: .96, roughness: .19, clearcoat: 1, clearcoatRoughness: .1, envMapIntensity: 1.7, side: THREE.DoubleSide })
          material.onBeforeCompile = shader => {
            shader.uniforms.uTime = uniforms.time
            shader.uniforms.uPointer = uniforms.pointer
            shader.vertexShader = 'uniform float uTime; uniform vec2 uPointer;\n' + shader.vertexShader
            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
              #include <begin_vertex>
              float ripple = sin(position.y * 3.0 + uTime * .7) * cos(position.x * 2.0 + uTime * .35);
              transformed += normal * ripple * .045;
              transformed.z += sin(position.x * 2.0 + uTime) * uPointer.x * .065;
            `)
          }
          return material
        })
        // Continuous curves echo the flourishes of the original CreationWorks emblem.
        class EcosystemCurve extends THREE.Curve<InstanceType<typeof THREE.Vector3>> {
          constructor(public phase: number) { super() }
          getPoint(t: number, target = new THREE.Vector3()) {
            const u = t * Math.PI * 2
            const radial = 1.38 + .45 * Math.cos(3 * u)
            const braid = this.phase + u * 3
            return target.set(radial * Math.cos(2 * u) + .19 * Math.cos(braid), radial * Math.sin(2 * u) + .19 * Math.sin(braid), .64 * Math.sin(3 * u) + .13 * Math.sin(braid))
          }
        }
        const curves = [0, 1, 2].map(i => new EcosystemCurve(i * Math.PI * 2 / 3))
        const geometries = curves.map(curve => new THREE.TubeGeometry(curve, mobile ? 150 : 280, .205, mobile ? 12 : 24, true))
        const strands = geometries.map((geometry, i) => {
          const mesh = new THREE.Mesh(geometry, materials[i]); sculpture.add(mesh); return mesh
        })
        sculpture.rotation.set(.25, -.3, -.5)
        const key = new THREE.DirectionalLight(0xffe8b7, 3.5)
        key.position.set(3, 4, 5); scene.add(key)
        const rim = new THREE.DirectionalLight(0xfff5dc, 2.3)
        rim.position.set(-3, 1, -2); scene.add(rim)
        scene.add(new THREE.AmbientLight(0xe7d8bf, .6))
        const orbitGroup = new THREE.Group()
        scene.add(orbitGroup)
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xb49b65, transparent: true, opacity: .17 })
        const orbitGeometries = [0, 1].map(i => {
          const points = Array.from({ length: 181 }, (_, j) => {
            const a = j / 180 * Math.PI * 2
            return new THREE.Vector3(Math.cos(a) * (2.5 + i * .4), Math.sin(a) * (2.5 + i * .4), 0)
          })
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const line = new THREE.Line(geometry, orbitMaterial)
          line.rotation.set(.9 + i * .3, .2, -.35 + i); orbitGroup.add(line); return geometry
        })
        const count = mobile ? 200 : 650
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
          const angle = i * 2.399963
          const radius = 2.1 + ((i * 73) % 100) / 100 * 2.8
          positions.set([Math.cos(angle) * radius, Math.sin(angle) * radius * .75, -1.6 + Math.sin(i * 15.7) * 1.4], i * 3)
        }
        const particleGeometry = new THREE.BufferGeometry()
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        const particleMaterial = new THREE.PointsMaterial({ color: 0xe5c983, size: .012, transparent: true, opacity: .48, depthWrite: false })
        const particles = new THREE.Points(particleGeometry, particleMaterial); scene.add(particles)
        const satelliteGeometry = new THREE.SphereGeometry(.045, 12, 8)
        const satelliteMaterial = new THREE.MeshStandardMaterial({ color: 0xf0d797, emissive: 0xb59048, emissiveIntensity: .5, metalness: .9, roughness: .2 })
        const satellites = Array.from({ length: 8 }, () => {
          const mesh = new THREE.Mesh(satelliteGeometry, satelliteMaterial); orbitGroup.add(mesh); return mesh
        })
        let visible = true, frame = 0, last = 0, elapsed = 0, scrollTarget = 0, scroll = 0, drag = false, spinTarget = 0, spin = 0
        const pointer = new THREE.Vector2(), smoothPointer = new THREE.Vector2()
        const render = () => renderer.render(scene, camera)
        const resize = () => {
          const bounds = element.getBoundingClientRect()
          if (!bounds.width || !bounds.height) return
          renderer.setSize(bounds.width, bounds.height)
          camera.aspect = bounds.width / bounds.height
          camera.position.z = bounds.width < 500 ? 8.8 : 8.3
          camera.updateProjectionMatrix(); render()
        }
        const animate = (time: number) => {
          frame = 0
          if (!visible || document.hidden || reduced()) return
          frame = requestAnimationFrame(animate)
          if (time - last < (mobile ? 33 : 16)) return
          const delta = Math.min((time - last) / 1000, .05)
          last = time; elapsed += delta
          scroll += (scrollTarget - scroll) * .06; spin += (spinTarget - spin) * .06
          smoothPointer.lerp(pointer, .045)
          uniforms.time.value = elapsed; uniforms.pointer.value.copy(smoothPointer)
          sculpture.rotation.set(.25 + smoothPointer.y * .22 + scroll * .45, -.3 + elapsed * .09 + smoothPointer.x * .35 + spin + scroll * .65, -.5 + Math.sin(elapsed * .15) * .08 - scroll * .28)
          sculpture.position.y = Math.sin(elapsed * .5) * .055 + scroll * .12
          sculpture.scale.setScalar(1 - scroll * .1)
          strands.forEach((strand, i) => {
            const separation = activeRef.current === 1 ? .065 : activeRef.current === 2 ? .1 : 0
            strand.position.z += ((i - 1) * separation - strand.position.z) * .04
            materials[i].emissive.setHex(colors[i])
            const target = activeRef.current === i ? .1 : .015
            materials[i].emissiveIntensity += (target - materials[i].emissiveIntensity) * .04
          })
          satellites.forEach((satellite, i) => {
            const a = i / 8 * Math.PI * 2 + elapsed * .045
            satellite.position.set(Math.cos(a) * 2.7, Math.sin(a) * 1.6, -.5 + Math.sin(a) * .7)
          })
          particles.rotation.z = elapsed * .008; orbitGroup.rotation.y = smoothPointer.x * .1
          render()
        }
        const update = () => {
          if (!visible || document.hidden || reduced()) { cancelAnimationFrame(frame); frame = 0; render() }
          else if (!frame) { last = performance.now(); frame = requestAnimationFrame(animate) }
        }
        const onScroll = () => { scrollTarget = Math.min(Math.max(-(element.closest('.hero')?.getBoundingClientRect().top || 0) / innerHeight, 0), 1.6) }
        const move = (event: PointerEvent) => {
          if (reduced() || (coarse && !drag)) return
          const rect = element.getBoundingClientRect(), nextX = (event.clientX - rect.left) / rect.width * 2 - 1
          if (drag) spinTarget += (nextX - pointer.x) * 1.5
          pointer.set(nextX, (event.clientY - rect.top) / rect.height * 2 - 1)
        }
        const reset = () => { if (!drag) pointer.set(0, 0) }
        const down = (event: PointerEvent) => { if (reduced()) return; drag = true; element.setPointerCapture(event.pointerId); move(event) }
        const up = () => { drag = false; pointer.set(0, 0) }
        const contextLost = (event: Event) => { event.preventDefault(); visible = false; cancelAnimationFrame(frame); frame = 0; setState('fallback') }
        const contextRestored = () => { visible = true; setState('ready'); update() }
        const sizes = new ResizeObserver(resize); sizes.observe(element)
        const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() }); visibility.observe(element)
        const motion = new MutationObserver(update); motion.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] })
        element.addEventListener('pointermove', move); element.addEventListener('pointerleave', reset)
        element.addEventListener('pointerdown', down); element.addEventListener('pointerup', up); element.addEventListener('pointercancel', up)
        window.addEventListener('scroll', onScroll, { passive: true }); document.addEventListener('visibilitychange', update); media.addEventListener('change', update)
        renderer.domElement.addEventListener('webglcontextlost', contextLost); renderer.domElement.addEventListener('webglcontextrestored', contextRestored)
        onScroll(); resize(); setState('ready'); update()
        cleanup = () => {
          cancelAnimationFrame(frame); sizes.disconnect(); visibility.disconnect(); motion.disconnect()
          element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', reset)
          element.removeEventListener('pointerdown', down); element.removeEventListener('pointerup', up); element.removeEventListener('pointercancel', up)
          window.removeEventListener('scroll', onScroll); document.removeEventListener('visibilitychange', update); media.removeEventListener('change', update)
          renderer.domElement.removeEventListener('webglcontextlost', contextLost); renderer.domElement.removeEventListener('webglcontextrestored', contextRestored)
          geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); orbitGeometries.forEach(geometry => geometry.dispose()); orbitMaterial.dispose()
          particleGeometry.dispose(); particleMaterial.dispose(); satelliteGeometry.dispose(); satelliteMaterial.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove()
        }
      } catch { if (!disposed) setState('fallback') }
    }
    const loader = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { void load(); loader.disconnect() } }, { rootMargin: '150px' })
    loader.observe(element)
    return () => { disposed = true; loader.disconnect(); cleanup() }
  }, [])
  return (
    <div className={`brand-sculpture liquid-sculpture ${state === 'ready' ? 'is-ready' : ''}`} ref={host} data-state={state}>
      <div className="sculpture-fallback" aria-hidden="true"><i /><i /><i /><span>W</span></div>
      <div className="sculpture-caption" aria-hidden="true"><span>01 BUILD</span><span>02 AUTOMATE</span><span>03 GROW</span></div>
      <span className="scene-instruction">{language === 'en' ? 'DRAG TO EXPLORE / SCROLL TO TRANSFORM' : 'ARRASTRÁ PARA EXPLORAR / SCROLL PARA TRANSFORMAR'}</span>
    </div>
  )
}
