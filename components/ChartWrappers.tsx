import React from 'react';
import { XAxis as RechartsXAxis, YAxis as RechartsYAxis, XAxisProps, YAxisProps } from 'recharts';

export const XAxis: React.FC<XAxisProps> = (props) => {
  return <RechartsXAxis {...props} />;
};

export const YAxis: React.FC<YAxisProps> = (props) => {
  return <RechartsYAxis {...props} />;
};