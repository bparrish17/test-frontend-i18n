export const calculateVisibleLabelsCount = ({ labels, containerRef }) => {
  if (!containerRef.current) {
    return labels.length;
  }

  const containerRect = containerRef.current.getBoundingClientRect();

  const children = [...containerRef.current.children];

  let count = 0;
  for (const child of children) {
    const childRect = child.getBoundingClientRect();

    // check if child is in the first row
    if (childRect.top === containerRect.top) {
      count++;
    }
  }

  return count;
};
