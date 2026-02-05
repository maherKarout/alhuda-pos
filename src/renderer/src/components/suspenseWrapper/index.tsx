import { ReactNode, Suspense, ComponentType } from 'react'
import Loader from '../loader'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'

import ErrorBoundary from '../error/error-boundary'
const SuspenseWrapper = (Component: ComponentType<any>) => (props: any) => {
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Component {...props} />
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>
    </Suspense>
  )
}

export default SuspenseWrapper
