import { Suspense, lazy } from 'react'
import { Icon } from '@iconify/react'
const Map = lazy(() => import('./Map'))

export const MapSuspense = () => {
  return (
    <div className='map border-input mt-12 h-96 w-full overflow-hidden rounded-xl border shadow-md'>
      <Suspense
        fallback={
          <div className='flex h-full w-full items-center justify-center'>
            <Icon icon='svg-spinners:3-dots-scale' className='h-10 w-10' />
          </div>
        }
      >
        <Map
          zoom={6}
          pitch={45}
          interactive={false}
          latitude={39.8807948544334}
          longitude={-95.6983122797664}
        />
      </Suspense>
    </div>
  )
}
