'use client'

import { useEffect, useRef } from 'react'

export function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let animationId: number
    let disposed = false

    const showOverlay = (message: string) => {
      const el = overlayRef.current
      if (!el) return
      el.textContent = message
      el.classList.remove('hidden')
      el.classList.add('flex')
    }

    const initScene = async () => {
      const THREE = await import('three')
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader')

      const container = containerRef.current!
      const width = container.clientWidth
      const height = container.clientHeight

      if (!width || !height) {
        if (!disposed) showOverlay('Ошибка загрузки 3D. Перезагрузите страницу')
        return
      }

      // Сцена
      const scene = new THREE.Scene()
      
      // Камера
      const camera = new THREE.PerspectiveCamera(
        45,
        width / height,
        0.1,
        1000
      )
      camera.position.z = 5

      // Рендерер
      let renderer: THREE.WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      } catch (error) {
        console.error('[v0] Failed to init WebGL renderer:', error)
        if (!disposed) showOverlay('Ошибка загрузки 3D. Перезагрузите страницу')
        return
      }
      renderer.setSize(width, height)
      // Ограничиваем pixelRatio для снижения нагрузки на GPU на Retina-экранах
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
      renderer.setClearColor(0x000000, 0)
      container.appendChild(renderer.domElement)

      // Освещение
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 10, 7)
      scene.add(directionalLight)

      const pointLight = new THREE.PointLight(0x00a1ff, 0.5)
      pointLight.position.set(-5, -5, 5)
      scene.add(pointLight)

      // Загрузка модели
      const loader = new GLTFLoader()
      let model: THREE.Group

      const loadModel = (url: string) =>
        new Promise<any>((resolve, reject) => {
          loader.load(url, resolve, undefined, reject)
        })

      try {
        const envUrl = process.env.NEXT_PUBLIC_3D_MODEL_URL
        const localDefault = '/models/head.glb'
        const remoteFallback =
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the_head_of_the_sculpture_use_zbrush-xNHwwBEAuQ0CeHJJSs8BJBXeHG57hr.glb'

        const primaryUrl = envUrl || localDefault

        let gltf: any
        try {
          gltf = await loadModel(primaryUrl)
        } catch (e) {
          if (!envUrl && primaryUrl === localDefault) {
            gltf = await loadModel(remoteFallback)
          } else {
            throw e
          }
        }
        
        model = gltf.scene
        model.scale.set(1.4, 1.4, 1.4)
        model.rotation.order = 'YXZ'
        model.rotation.set(0, Math.PI, 0)
        scene.add(model)
      } catch (error) {
        console.error('[v0] Failed to load model:', error)
        if (!disposed) showOverlay('Ошибка загрузки 3D. Перезагрузите страницу')
        return
      }

      // Отслеживание мыши
      let targetRotationX = 0
      let targetRotationY = Math.PI

      const onMouseMove = (e: MouseEvent) => {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1
        const mouseY = -(e.clientY / window.innerHeight) * 2 + 1
        
        targetRotationY = Math.PI + mouseX * 0.5
        targetRotationX = mouseY * 0.3
      }

      window.addEventListener('mousemove', onMouseMove)

      // Анимация
      const animate = () => {
        animationId = requestAnimationFrame(animate)

        if (model) {
          model.rotation.x += (targetRotationX - model.rotation.x) * 0.05
          model.rotation.y += (targetRotationY - model.rotation.y) * 0.05
        }

        renderer.render(scene, camera)
      }

      animate()

      // Обработка изменения размера
      const onWindowResize = () => {
        const newWidth = container.clientWidth
        const newHeight = container.clientHeight
        if (!newWidth || !newHeight) return
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer.setSize(newWidth, newHeight)
      }

      window.addEventListener('resize', onWindowResize)

      // Очистка
      return () => {
        disposed = true
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onWindowResize)
        cancelAnimationFrame(animationId)
        renderer.dispose()
        container.removeChild(renderer.domElement)
      }
    }

    const cleanup = initScene()
    
    return () => {
      cleanup?.then(fn => fn?.())
    }
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden relative">
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/30 text-white/70 text-sm font-thin text-center px-4"
      >
        Ошибка загрузки 3D. Перезагрузите страницу
      </div>
    </div>
  )
}
