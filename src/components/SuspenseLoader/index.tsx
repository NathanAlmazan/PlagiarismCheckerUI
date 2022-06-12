import { Suspense, ReactNode } from 'react';
import Loader from "./Loader";

type SuspenseProps = {
    children: ReactNode
}

function SuspenseLoader(props: SuspenseProps) {
  return (
    <Suspense fallback={<Loader />}>
        {props.children}
    </Suspense>
  )
}

export default SuspenseLoader