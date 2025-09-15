import { useEffect, useState } from 'react';
import { Droppable as OriginalDroppable, DroppableProps } from 'react-beautiful-dnd';

export const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  return enabled ? (
    <OriginalDroppable {...props}>{children}</OriginalDroppable>
  ) : (
    <>{children({})}</>
  );
};
