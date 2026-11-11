import { Svg, Line } from '@react-pdf/renderer';

export default function PDFPageDivider() {
  return (
    <Svg
      width='100%'
      height={1}
      viewBox='0 0 639 1'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <Line
        x1={0}
        y1={0.5}
        x2={639.5}
        y2={0.5}
        stroke='#C8D6E4'
      />
    </Svg>
  );
}
