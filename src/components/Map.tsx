import { useRef, useEffect } from 'react'
import { ArcLayer } from '@deck.gl/layers'
import { MapboxOverlay } from '@deck.gl/mapbox'
import 'maplibre-gl/dist/maplibre-gl.css'
import maplibre from 'maplibre-gl'
import '@/styles/map.css'

const { Map } = maplibre

import { MAPTILER_API_KEY, MAP_DATA } from 'astro:env/client'

interface MapProps {
  latitude: number
  longitude: number
  zoom: number
  pitch: number
  interactive: boolean
}

type Arc = {
  sourcePosition: [longitude: number, latitude: number]
  targetPosition: [longitude: number, latitude: number]
}

function getStyle(theme: string): string {
  return `https://api.maptiler.com/maps/dataviz-${theme}/style.json?key=${MAPTILER_API_KEY}`
}

export default (props: MapProps) => {
  const mapContainer = useRef(null)
  const map = useRef<maplibregl.Map | null>(null)
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    if (map.current) return

    const rootInDarkMode = document.documentElement.classList.contains('dark')

    map.current = new Map({
      container: mapContainer.current ?? '',
      interactive: props.interactive,
      center: [props.longitude, props.latitude],
      zoom: props.zoom,
      pitch: props.pitch,
      maxPitch: 85,
      style: getStyle(rootInDarkMode ? 'dark' : 'light')
    })

    // https://maplibre.org/maplibre-gl-js/docs/examples/animate-camera-around-point/
    const rotateCamera = (timestamp: number) => {
      // clamp the rotation between 0 -360 degrees
      // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
      map.current?.rotateTo((timestamp / 120) % 360, { animate: false })
      // Request the next frame of the animation.
      animationFrameId.current = requestAnimationFrame(rotateCamera)
    }

    const handleThemeChange = (e: Event) => {
      map.current?.setStyle(getStyle((e as CustomEvent).detail.theme))
    }

    document.addEventListener('theme-change', handleThemeChange)

    map.current.on('load', () => {
      const arcData = JSON.parse(window.atob(MAP_DATA)) as Arc[]
      const layer = new ArcLayer({
        id: 'arc-layer',
        data: arcData,
        getSourceColor: [96, 165, 250],
        getTargetColor: [48, 98, 179],
        getWidth: 5,
        beforeId: 'Place labels'
      })

      arcData.forEach((arc) => {
        // Create source marker
        new maplibre.Marker({
          color: '#60A5FA' // blue-400
        })
          .setLngLat([arc.sourcePosition[0], arc.sourcePosition[1]])
          .addTo(map.current!)

        // Create target marker
        new maplibre.Marker({
          color: '#3062B3' // darker blue
        })
          .setLngLat([arc.targetPosition[0], arc.targetPosition[1]])
          .addTo(map.current!)
      })

      const overlay = new MapboxOverlay({
        interleaved: true,
        layers: [layer]
      })

      map.current?.addControl(overlay)

      // Start the animation.
      rotateCamera(0)
    })

    // Cleanup function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      document.removeEventListener('theme-change', handleThemeChange)
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  })

  return (
    <div ref={mapContainer} className='border-input relative h-full w-full' />
  )
}
