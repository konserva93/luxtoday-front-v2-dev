import { useRef, useEffect, EffectCallback, DependencyList } from 'react'

const useUpdateEffect = (effect: EffectCallback, dependencies?: DependencyList) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    } 
    return effect();
  }, dependencies);
}

export default useUpdateEffect