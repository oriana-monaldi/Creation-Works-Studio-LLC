import { useEffect, useRef, useState } from 'react'

export function BrandSculpture({ onReady }: { onReady?: () => void }) {
  const readyCallback = useRef(onReady)
  readyCallback.current = onReady
  const host = useRef<HTMLDivElement>(null)

  const [ready, setReady] = useState(false)

  useEffect(() => {
    const element = host.current
    if (!element) return
    let disposed = false
    let cleanup = () => {}
    void Promise.all([import('three'), import('three/addons/environments/RoomEnvironment.js')]).then(([T, { RoomEnvironment }]) => {
      if (disposed) return
      let renderer: InstanceType<typeof T.WebGLRenderer>
      try { renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' }) } catch { return }
      renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 768 ? 1.25 : 1.75))
      renderer.setClearColor(0x000000, 0)
      renderer.toneMapping = T.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.65
      element.appendChild(renderer.domElement)
      const scene = new T.Scene()
      const camera = new T.PerspectiveCamera(38, 1, 0.1, 50)
      camera.position.set(0, 0, 8.8)
      const pmrem = new T.PMREMGenerator(renderer)
      const room = new RoomEnvironment()
      const environment = pmrem.fromScene(room, 0.04)
      scene.environment = environment.texture
      room.dispose()
      pmrem.dispose()
      scene.add(new T.AmbientLight(0xffffff, 0.6))
      const key = new T.DirectionalLight(0xffe6b1, 6)
      key.position.set(3, 4, 5)
      const rim = new T.DirectionalLight(0xffcf69, 7)
      rim.position.set(-4, 0, 3)
      scene.add(key, rim)
      const group = new T.Group()
      scene.add(group)
      const dummy = new T.Object3D()
      const target = new T.WebGLRenderTarget(1, 1)
      const screenScene = new T.Scene()
      const screenCamera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const screenGeometry = new T.PlaneGeometry(2, 2)
      const screenMaterial = new T.ShaderMaterial({
        uniforms: { source: { value: target.texture }, pointer: { value: new T.Vector2(0.5, 0.5) }, time: { value: 0 }, strength: { value: 0 }, aspect: { value: 1 } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }',
        fragmentShader: `uniform sampler2D source; uniform vec2 pointer; uniform float time; uniform float strength; uniform float aspect; varying vec2 vUv;
          void main(){ vec2 delta=vUv-pointer; delta.x*=aspect; float radius=length(delta); float influence=exp(-radius*7.0); vec2 offset=normalize(delta+vec2(.0001))*sin(radius*38.0-time*3.0)*influence*.025*strength;
          vec2 uv=vUv+offset; 
          vec4 c=texture2D(source,uv); c.rgb=mix(c.rgb,vec3(dot(c.rgb,vec3(.299,.587,.114)))*vec3(1.18,.93,.55),.35);
          float grain=fract(sin(dot(vUv+time*.001,vec2(12.9898,78.233)))*43758.5453);
          vec3 bg=mix(vec3(.008,.007,.005),vec3(.028,.022,.012),max(0.,1.-length((vUv-.5)*1.4)));
          gl_FragColor=vec4(mix(bg,c.rgb,c.a)+(grain-.5)*.018,1.); }`,
        depthTest: false, depthWrite: false,
      })
      screenScene.add(new T.Mesh(screenGeometry, screenMaterial))
      // The reference is an irregular luminous web with a dominant central hub.
      const bases: InstanceType<typeof T.Vector3>[] = [new T.Vector3(0, 0, .55)]
      const nodes: InstanceType<typeof T.Vector3>[] = [bases[0].clone()]
      const radii = [.25]
      const random = (seed: number) => { const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n) }
      for (let i = 1; i < 135; i++) {
        const a = i * 2.399963
        const r = Math.sqrt(random(i + 7))
        const point = new T.Vector3(Math.cos(a) * r * 3.25, Math.sin(a) * r * 2, (random(i + 43) - .5) * 2.3)
        bases.push(point); nodes.push(point.clone())
        radii.push(i % 13 === 0 ? .14 : .025 + random(i + 71) * .047)
      }
      const routes: [number, number][] = []
      const seen = new Set<string>()
      const connect = (from: number, to: number) => {
        const key = `${Math.min(from, to)}:${Math.max(from, to)}`
        if (!seen.has(key)) { seen.add(key); routes.push([from, to]) }
      }
      bases.forEach((point, from) => {
        const nearest = bases.map((_, j) => j).filter(j => j !== from)
          .sort((a, b) => point.distanceToSquared(bases[a]) - point.distanceToSquared(bases[b]))
        nearest.slice(0, from === 0 ? 22 : 4).forEach(to => connect(from, to))
      })
      const pebbleGeometry = new T.SphereGeometry(1, 16, 12)
      const pebbleMaterial = new T.MeshPhysicalMaterial({ color: 0xffc34d, metalness: .85, roughness: .24, clearcoat: 1, emissive: 0xb97308, emissiveIntensity: .4, envMapIntensity: 1.1, transparent: true })
      const swarm = new T.InstancedMesh(pebbleGeometry, pebbleMaterial, bases.length)
      swarm.instanceMatrix.setUsage(T.DynamicDrawUsage)
      group.add(swarm)
      const glowGeometry = new T.PlaneGeometry(1, 1)
      const glowMaterial = new T.ShaderMaterial({
        transparent: true, depthWrite: false, blending: T.AdditiveBlending,
        uniforms: { gold: { value: new T.Color(0xffa72b) }, opacity: { value: 1 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv;
          vec4 center=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.);
          float size=length(instanceMatrix[0].xyz)*7.;
          center.xy+=position.xy*size; gl_Position=projectionMatrix*center; }`,
        fragmentShader: `varying vec2 vUv; uniform vec3 gold; uniform float opacity; void main(){
          float r=length(vUv-.5)*2.; float halo=exp(-r*r*5.)*.65;
          float star=exp(-abs(vUv.x-.5)*100.)*exp(-r*5.)*.1+exp(-abs(vUv.y-.5)*100.)*exp(-r*5.)*.1;
          gl_FragColor=vec4(gold,(halo+star)*opacity); }`,
      })
      const glows = new T.InstancedMesh(glowGeometry, glowMaterial, bases.length)
      glows.instanceMatrix.setUsage(T.DynamicDrawUsage)
      glows.frustumCulled = false
      group.add(glows)
      // A continuous metallic ribbon winds through the scene with scroll inertia.
      const ribbonSegments = 180
      const ribbonPositions = new Float32Array((ribbonSegments + 1) * 4 * 3)
      const ribbonIndices: number[] = []
      for (let i = 0; i < ribbonSegments; i++) {
        for (let side = 0; side < 4; side++) {
          const a = i * 4 + side, b = i * 4 + (side + 1) % 4
          ribbonIndices.push(a, b, a + 4, b, b + 4, a + 4)
        }
      }
      const ribbonGeometry = new T.BufferGeometry()
      const ribbonAttribute = new T.BufferAttribute(ribbonPositions, 3)
      ribbonAttribute.setUsage(T.DynamicDrawUsage)
      ribbonGeometry.setAttribute('position', ribbonAttribute)
      ribbonGeometry.setIndex(ribbonIndices)
      const ribbonMaterial = new T.MeshPhysicalMaterial({ color: 0xd8b55e, metalness: 1, roughness: .19, clearcoat: 1, side: T.DoubleSide, envMapIntensity: 1.4, transparent: true, opacity: 0 })
      const ribbon = new T.Mesh(ribbonGeometry, ribbonMaterial)
      ribbon.frustumCulled = false
      group.add(ribbon)
      const center = new T.Vector3(), next = new T.Vector3(), tangent = new T.Vector3()
      const normal = new T.Vector3(), binormal = new T.Vector3(), up = new T.Vector3(0, 0, 1)
      let scrollPhase = 0
      let weaveMix = 0
      let endingMix = 0
      const ribbonPoint = (u: number, time: number, phase: number, out: InstanceType<typeof T.Vector3>) => {
        const a = u * Math.PI * 3.2 + phase * .85
        const x = Math.sin(a) * 2.5 + .6 + smoothX * .4
        const y = (u - .5) * 9 + Math.cos(a * .7 + time * .2) * .4
        const z = -1.4 + Math.cos(a + time * .12) * 1.5
        const coil = u * Math.PI * 4 + phase * .35
        const wovenX = Math.cos(coil) * (1.8 + .3 * Math.sin(coil * 2))
        const wovenY = (u - .5) * 5 + Math.sin(coil) * .7
        const wovenZ = Math.sin(coil) * 1.5
        const loop = u * Math.PI * 2
        const closeX = Math.cos(loop) * 1.7 + 1.2
        const closeY = Math.sin(loop) * 1.15
        const closeZ = Math.sin(loop * 2) * .7
        return out.set(T.MathUtils.lerp(T.MathUtils.lerp(x, wovenX, weaveMix), closeX, endingMix), T.MathUtils.lerp(T.MathUtils.lerp(y, wovenY, weaveMix), closeY, endingMix), T.MathUtils.lerp(T.MathUtils.lerp(z, wovenZ, weaveMix), closeZ, endingMix))
      }
      const routePositions = new Float32Array(routes.length * 6)
      const routeGeometry = new T.BufferGeometry()
      const routeAttribute = new T.BufferAttribute(routePositions, 3)
      routeAttribute.setUsage(T.DynamicDrawUsage)
      routeGeometry.setAttribute('position', routeAttribute)
      const routeMaterial = new T.LineBasicMaterial({ color: 0xd9ab50, transparent: true, opacity: .72, depthWrite: false })
      const connections = new T.LineSegments(routeGeometry, routeMaterial)
      connections.frustumCulled = false
      group.add(connections)
      const pulseGeometry = new T.SphereGeometry(.018, 6, 6)
      const pulseMaterial = new T.MeshBasicMaterial({ color: 0xffe5a5, transparent: true })
      const pulses = new T.InstancedMesh(pulseGeometry, pulseMaterial, routes.length)
      pulses.instanceMatrix.setUsage(T.DynamicDrawUsage)
      pulses.frustumCulled = false
      swarm.frustumCulled = false
      group.add(pulses)
      const particlesGeometry = new T.BufferGeometry()
      const positions = new Float32Array(220 * 3)
      for (let i = 0; i < 220; i++) {
        positions[i * 3] = Math.sin(i * 127.1) * 6
        positions[i * 3 + 1] = Math.cos(i * 311.7) * 4
        positions[i * 3 + 2] = Math.sin(i * 73.3) * 3 - 2
      }
      particlesGeometry.setAttribute('position', new T.BufferAttribute(positions, 3))
      const particlesMaterial = new T.PointsMaterial({ color: 0xe9dab7, size: 0.018, transparent: true, opacity: 0.65 })
      const particles = new T.Points(particlesGeometry, particlesMaterial)
      scene.add(particles)
      let frame = 0
      let visible = true
      let pointerX = 0
      let pointerY = 0
      let smoothX = 0
      let smoothY = 0

      let elapsed = 0
      let last = 0
      let visualScroll = window.scrollY
      let scrollSampleTime = 0
      const media = matchMedia('(prefers-reduced-motion: reduce)')
      const reduced = () => media.matches || document.documentElement.dataset.motion === 'reduced'
      const paint = () => {
        // One continuous, time-based scroll response for camera and scene alike.
        // Wheel events can arrive in large steps; the sculpture should glide.
        const sampleTime = performance.now()
        const delta = Math.min((sampleTime - scrollSampleTime) / 1000, .05)
        scrollSampleTime = sampleTime
        visualScroll = reduced() ? window.scrollY : T.MathUtils.lerp(visualScroll, window.scrollY, 1 - Math.exp(-delta * 7))
        const scrollLag = window.scrollY - visualScroll
        const sectionTop = (id: string) => (document.getElementById(id)?.getBoundingClientRect().top ?? innerHeight * 2) + scrollLag
        const progress = visualScroll / Math.max(innerHeight, 1)
        const pageProgress = visualScroll / Math.max(document.documentElement.scrollHeight - innerHeight, 1)
        smoothX += (pointerX - smoothX) * 0.045
        smoothY += (pointerY - smoothY) * 0.045

        const t = elapsed
        const studioTop = sectionTop('studio')
        const weavePhase = T.MathUtils.clamp((innerHeight * .7 - studioTop) / innerHeight, 0, 1)
        weaveMix = weavePhase * weavePhase * (3 - 2 * weavePhase)
        const contactPosition = sectionTop('contact')
        const endingPhase = T.MathUtils.clamp((innerHeight * .5 - contactPosition) / innerHeight, 0, 1)
        endingMix = endingPhase * endingPhase * (3 - 2 * endingPhase)
        const servicesTop = sectionTop('capabilities')
        const phase = T.MathUtils.clamp((innerHeight * .85 - servicesTop) / (innerHeight * .9), 0, 1)
        const transition = phase * phase * (3 - 2 * phase)
        // Keep the network topology intact: pulling linked nodes onto the ribbon
        // produces stretched, crossing lines halfway through the transition.
        const networkOpacity = 1 - T.MathUtils.smoothstep(phase, 0, .72)
        const ribbonReveal = T.MathUtils.smoothstep(phase, .38, 1)
        group.visible = true
        pebbleMaterial.opacity = networkOpacity
        routeMaterial.opacity = .72 * networkOpacity
        pulseMaterial.opacity = networkOpacity
        glowMaterial.uniforms.opacity.value = networkOpacity
        element.dataset.stage = transition > .99 ? 'ribbon' : transition > .01 ? 'transition' : 'neural'
        element.style.setProperty('--network-opacity', String(networkOpacity))
        element.style.setProperty('--journey-progress', String(pageProgress))

        group.rotation.set(smoothY * .12, -.18 + Math.sin(t * .14 + progress * .15) * .12 + smoothX * .2, Math.sin(t * .2) * .025)
        group.position.set(Math.cos(pageProgress * Math.PI * 4) * 1.35, Math.sin(pageProgress * Math.PI * 6) * .4, Math.sin(pageProgress * Math.PI * 3) * .4)
        group.scale.setScalar(1.1 - transition * .08)
        camera.position.x = smoothX * .35 + Math.sin(pageProgress * Math.PI * 2) * .4
        camera.position.y = -smoothY * .3 + Math.sin(pageProgress * Math.PI * 3) * .25
        camera.position.z = (camera.aspect < .8 ? 10.5 : 8.8) - Math.sin(pageProgress * Math.PI) * .65
        camera.lookAt(0, 0, 0)
        const expansion = (1 - Math.cos(pageProgress * Math.PI * 6)) * .15
        nodes.forEach((point, i) => {
          const base = bases[i]
          const wave = reduced() ? 0 : Math.sin(t * .65 + base.x * 1.2 + i * .13)
          point.set(base.x * (1 + expansion * .12), base.y + wave * .065, base.z + wave * .095)
          point.x -= transition * .6
          point.z -= transition * 1.2
          const dx = point.x - smoothX * 5
          const dy = point.y + smoothY * 5
          const repel = reduced() ? 0 : Math.exp(-(dx * dx + dy * dy) * .7) * .025
          point.x += dx * repel
          point.y += dy * repel
          dummy.position.copy(point)
          dummy.rotation.set(0, 0, 0)
          const activation = radii[i] * (1 + Math.pow(Math.max(0, Math.sin(t * 1.1 - base.x * 1.2 + i * .3)), 6) * .15)
          dummy.scale.setScalar(activation)
          dummy.updateMatrix()
          swarm.setMatrixAt(i, dummy.matrix)
          glows.setMatrixAt(i, dummy.matrix)
        })
        swarm.instanceMatrix.needsUpdate = true
        glows.instanceMatrix.needsUpdate = true
        routes.forEach(([from, to], i) => {
          const start = nodes[from], end = nodes[to]
          const offset = i * 6
          routePositions[offset] = start.x
          routePositions[offset + 1] = start.y
          routePositions[offset + 2] = start.z
          routePositions[offset + 3] = end.x
          routePositions[offset + 4] = end.y
          routePositions[offset + 5] = end.z
          const phase = reduced() ? .5 : (t * .22 + i * .137 + pageProgress) % 1
          dummy.position.copy(start).lerp(end, phase)
          dummy.scale.setScalar(Math.sin(phase * Math.PI) * .85)
          dummy.updateMatrix()
          pulses.setMatrixAt(i, dummy.matrix)
        })
        routeAttribute.needsUpdate = true
        pulses.instanceMatrix.needsUpdate = true
        const contactTop = sectionTop('contact')
        const quietEnding = T.MathUtils.clamp((innerHeight * .5 - contactTop) / innerHeight, 0, 1)
        const ribbonOpacity = reduced() ? 0 : ribbonReveal * (1 - quietEnding * .6)
        ribbon.visible = ribbonOpacity > .005
        ribbonMaterial.opacity = ribbonOpacity
        if (weaveMix > .99) element.dataset.stage = 'woven'
        if (quietEnding > .5) element.dataset.stage = 'closing'
        scrollPhase += ((reduced() ? 0 : progress) - scrollPhase) * .055
        for (let i = 0; i <= ribbonSegments; i++) {
          const u = i / ribbonSegments
          ribbonPoint(u, t, scrollPhase, center)
          ribbonPoint(u + .001, t, scrollPhase, next)
          tangent.copy(next).sub(center).normalize()
          normal.crossVectors(tangent, up).normalize()
          binormal.crossVectors(tangent, normal).normalize()
          const twist = u * Math.PI * 3 + scrollPhase * .4 + t * .15
          const taper = .15 + Math.sin(u * Math.PI) * .85
          for (let j = 0; j < 4; j++) {
            const width = (j === 0 || j === 3 ? -1 : 1) * .16 * taper
            const thickness = (j < 2 ? -1 : 1) * .035 * taper
            const nx = Math.cos(twist) * width - Math.sin(twist) * thickness
            const ny = Math.sin(twist) * width + Math.cos(twist) * thickness
            const offset = (i * 4 + j) * 3
            ribbonPositions[offset] = center.x + normal.x * nx + binormal.x * ny
            ribbonPositions[offset + 1] = center.y + normal.y * nx + binormal.y * ny
            ribbonPositions[offset + 2] = center.z + normal.z * nx + binormal.z * ny
          }
        }
        ribbonAttribute.needsUpdate = true
        ribbonGeometry.computeVertexNormals()
        particles.rotation.y = t * 0.025 + smoothX * 0.05
        screenMaterial.uniforms.pointer.value.set(smoothX + .5, .5 - smoothY)
        screenMaterial.uniforms.time.value = t
        screenMaterial.uniforms.strength.value = reduced() ? 0 : 1
        renderer.setRenderTarget(target)
        renderer.render(scene, camera)
        renderer.setRenderTarget(null)
        renderer.render(screenScene, screenCamera)
      }
      const animate = (now: number) => {
        frame = 0
        if (!visible || document.hidden || reduced()) { last = 0; return }
        elapsed += last ? Math.min((now - last) / 1000, 0.05) : 0
        last = now
        paint()
        frame = requestAnimationFrame(animate)
      }
      const update = () => {
        if (reduced() || !visible || document.hidden) { cancelAnimationFrame(frame); frame = 0; last = 0; if (reduced()) paint() }
        else if (!frame) frame = requestAnimationFrame(animate)
      }
      const resize = () => {
        const { width, height } = element.getBoundingClientRect()
        renderer.setSize(width, height)
        const ratio = renderer.getPixelRatio()
        target.setSize(Math.max(1, width * ratio), Math.max(1, height * ratio))
        screenMaterial.uniforms.aspect.value = width / Math.max(height, 1)
        camera.aspect = width / Math.max(height, 1)
        camera.position.z = camera.aspect < 0.8 ? 10.5 : 8.8
        camera.updateProjectionMatrix()
        paint()
      }
      const move = (event: PointerEvent) => {
        pointerX = event.clientX / innerWidth - 0.5
        pointerY = event.clientY / innerHeight - 0.5
      }
      const scroll = () => { if (reduced()) paint() }
      const reset = () => { pointerX = 0; pointerY = 0 }
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
      observer.observe(element)
      const sizes = new ResizeObserver(resize)
      sizes.observe(element)
      const motionObserver = new MutationObserver(update)
      motionObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] })
      window.addEventListener('pointermove', move, { passive: true })
      window.addEventListener('scroll', scroll, { passive: true })
      document.addEventListener('pointerleave', reset)
      document.addEventListener('visibilitychange', update)
      media.addEventListener('change', update)
      resize()
      setReady(true)
      readyCallback.current?.()
      update()
      cleanup = () => {
        cancelAnimationFrame(frame)
        observer.disconnect(); sizes.disconnect(); motionObserver.disconnect()
        window.removeEventListener('pointermove', move)
        window.removeEventListener('scroll', scroll)
        document.removeEventListener('pointerleave', reset)
        document.removeEventListener('visibilitychange', update)
        media.removeEventListener('change', update)


        glowGeometry.dispose(); glowMaterial.dispose()
        ribbonGeometry.dispose(); ribbonMaterial.dispose()
        routeGeometry.dispose(); routeMaterial.dispose(); pulseGeometry.dispose(); pulseMaterial.dispose()
        particlesGeometry.dispose(); particlesMaterial.dispose(); environment.dispose()
        pebbleGeometry.dispose(); pebbleMaterial.dispose(); target.dispose(); screenGeometry.dispose(); screenMaterial.dispose()
        renderer.dispose(); renderer.domElement.remove()
      }
    }).catch(() => { /* Keep the CSS sculpture when WebGL is unavailable. */ })
    return () => { disposed = true; cleanup() }
  }, [])
  return <div className={`brand-sculpture ${ready ? 'is-ready' : ''}`} ref={host} aria-hidden="true">
    <div className="sculpture-fallback network-fallback" />
    <span className="sculpture-caption">NEURAL NETWORK / CONNECTED INTELLIGENCE</span>
  </div>
}
















