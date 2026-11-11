import { Stack } from '@chakra-ui/react';
import { useMemo, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BubbleController } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

class Custom extends BubbleController {
  draw() {
    super.draw(arguments);

    const meta = this.getMeta();
    const pt0 = meta.data[0];

    const { x, y } = pt0.getProps(['x', 'y']);
    const { radius } = pt0.options;

    const ctx = this.chart.ctx;
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - radius, y - radius, 2 * radius, 2 * radius);
    ctx.restore();
  }
}
Custom.id = 'derivedBubble';
Custom.defaults = BubbleController.defaults;

ChartJS.register(ArcElement, Custom, Tooltip, Legend);

const PersonInternalVsExternalChart = ({
  personInternalMeetings = [],
  personExternalMeetings = [],
  numOfDays
}) => {
  const { t } = useTranslation();

  const chartRef = useRef(null);
  const internalVsExternalData = useMemo(() => {
    const internalCount = personInternalMeetings.length;
    const externalCount = personExternalMeetings.length;
    const total = internalCount + externalCount;
    const internalPercentage = Math.round((internalCount / total) * 100);
    const externalPercentage = Math.round((externalCount / total) * 100);

    return {
      labels: ['Internal: ' + internalPercentage + '%', 'External: ' + externalPercentage + '%'],
      datasets: [
        {
          label: t('personInternalExternalChart.meetings'),
          data: [internalPercentage, externalPercentage],
          backgroundColor: ['#1353EC', '#6A9EEC']
        }
      ]
    };
  }, [personInternalMeetings, personExternalMeetings]);

  return (
    <Stack
      w='full'
      maxH='220px'
    >
      <Doughnut
        ref={chartRef}
        width={220}
        options={{
          hoverBorderColor: '#DEE1F4',
          borderColor: '#F3F7FB',
          borderWidth: 4,
          borderRadius: 0,
          borderJoinStyle: 'miter',
          borderAlign: 'inner',
          cutout: '50%',
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              fullSize: true,
              onClick: () => {},
              labels: {
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                title: (items) =>
                  items?.map((item) => (item.label.includes('Internal') ? 'Internal' : 'External')),
                label: () => `Past ${numOfDays} days`,
                footer: (items) =>
                  items?.map((item) => {
                    if (item.label.includes('Internal')) {
                      return `${personInternalMeetings?.length} meetings`;
                    }

                    return `${personExternalMeetings?.length} meetings`;
                  })
              },
              titleFont: { size: 14 },
              bodyFont: { size: 12 },
              footerFont: { size: 18 },
              footerMarginTop: 12,
              titleMarginBottom: 2,
              bodyColor: '#ADC0D6',
              backgroundColor: '#11161F',
              padding: 18,
              displayColors: false
            }
          }
        }}
        data={internalVsExternalData}
      />
    </Stack>
  );
};

export default PersonInternalVsExternalChart;
