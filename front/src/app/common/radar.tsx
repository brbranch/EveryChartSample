import * as React from "react";
import Chart = require("chart.js");

export interface RadarItem {
    name: string
    value: number
}

export interface RadarProps {
    datas: RadarItem[]
    className?: string
    responsive?: boolean
    average?: number
    width?: number
    height?: number
    small?: boolean
    image?: string
    onRenderEnd?: (base64: string) => void
}

export class RadarChart extends React.Component<RadarProps> {
    private canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    private data: RadarItem[] = [];

    constructor(props: any) {
        super(props);
    }

    private labels(): string[] {
        return this.props.datas.map(val => val.name);
    }

    private datas(): number[] {
        return this.props.datas.map(val => val.value);
    }

    private average(): number {
        if (this.props.average) {
            return Math.round(this.props.average * 10) / 10;
        }
        return 0;
    }

    private update(props: RadarProps) {
        const responsive = (props.responsive === undefined || props.responsive === null) ? true : props.responsive;
        const options: any = {
            type: 'radar',
            data: {
                labels: this.labels(),
                datasets: [{
                    data: this.datas(),
                    backgroundColor: 'rgba(75, 192, 192, 0.3)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    pointStyle: 'circle',
                    pointRadius: 1,
                }]
            },
            options: {
                responsive: responsive,
                legend: {
                    display: false
                },
                scale: {
                    ticks: {
                        min: 0, max: 5, stepSize: 2.5, display: false
                    },
                    angleLines: {
                        color: "rgba(0,0,0,0.1)"
                    },
                    gridLines : {
                        color: "rgba(0,0,0,0.1)"
                    },
                    pointLabels: {
                        fontColor: "rgba(0,0,0,0.6)"
                    }
                },
                animation: {
                    onComplete: function(e: any) {
                        if (props.onRenderEnd !== undefined) {
                            props.onRenderEnd(e.chart.toBase64Image());
                        }
                    }
                }
            },
            plugins: [
                {
                    afterDatasetsDraw: (chart: Chart , options: Chart.ChartConfiguration) => {
                        if (this.average() <= 0) {
                            return;
                        }
                        const area = chart.chartArea;
                        const center = {
                            x: (area.right - area.left) / 2,
                            y: (area.bottom - area.top) / 2
                        };
                        const ctx = chart.canvas.getContext("2d");
                        ctx.save();
                        ctx.beginPath();
                        if(this.props.small) {
                            ctx.font = "20px 'Arial'";
                        } else {
                            ctx.font = "30px 'Arial'";
                        }
                        ctx.textAlign = "center";
                        ctx.fillStyle = "#033";
                        ctx.textBaseline = "middle";
                        ctx.fillText("" + this.average() + "点", center.x, center.y + 5.0);
                        ctx.restore();
                    }
                }
            ]
        }
        if (this.canvasRef.current) {
            const ctx = this.canvasRef.current.getContext("2d");
            var myChart = new Chart(ctx, options);
        }
    }

    isChanges(): boolean {
        if (this.props.datas.length != this.data.length) {
            return true;
        }
        for(var i = 0; i < this.props.datas.length; i++) {
            if (this.props.datas[i].value !== this.data[i].value) {
                return true;
            }
            if (this.props.datas[i].name !== this.data[i].name) {
                return true;
            }
        }
        return false;
    }

    copy() {
        this.data = this.props.datas.map(val => { return {name: val.name, value: val.value}});
    }

    componentDidMount() {
        this.copy();
        this.update(this.props);
    }

    componentDidUpdate() {
        if (this.isChanges()) {
            this.copy();
            this.update(this.props);
        }
    }

    render() {
        const style: any = (this.props.width && this.props.height) ? {width: this.props.width, height: this.props.height}: undefined;
        if (this.props.responsive === false) {
            style.display = "inline-block";
        }
        return (
            <canvas className={this.props.className} style={style} ref={this.canvasRef}></canvas>
        )
    }
}
