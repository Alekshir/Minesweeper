import * as React from 'react';

type Props = {
    text: string;
    className: string
};

const ToolTip = ({ text, className }: Props) => <div className={className}>{text}</div>;

export default ToolTip;