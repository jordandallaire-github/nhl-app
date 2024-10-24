import { ComponentProps, FC, useEffect, useRef, useState } from 'react';

interface LazySvgProps extends ComponentProps<'svg'> {
  name: string;
  size: string,
  height?: string,
  width?: string,
  isStroke?: boolean
}

// This hook can be used to create your own wrapper component.
const useLazySvgImport = (name: string) => {
  const importRef = useRef<FC<ComponentProps<'svg'>>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        importRef.current = (
          await import(`../../assets/icons/${name}.svg?react`)
        ).default; // We use `?react` here following `vite-plugin-svgr`'s convention.
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [name]);

  return {
    error,
    loading,
    Svg: importRef.current,
  };
};

// Example wrapper component using the hook.
export const Svg = ({ name, size, isStroke, height, width}: LazySvgProps) => {
  const { loading, error, Svg } = useLazySvgImport(name);

  if (error) {
    return 'An error occurred';
  }

  if (loading) {
    return 'Loading...';
  }

  if (!Svg) {
    return null;
  }

  return (
    <Svg 
      className={`icon${isStroke ? " icon--stroke" : ""} icon--${size}`}
      height={height}
      width={width}
    />
  );
};
