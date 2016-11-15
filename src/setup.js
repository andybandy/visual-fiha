'use strict';
window.VF = window.VF || {};

var canvasLayers = [
  {
    name: 'background',
    weight: 0,
    drawFunction: function(ctx) {
      ctx.fillStyle = this.colorA;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },
    props: {
      colorA: ['string', true, '#bbb']
    }
  },

  {
    name: 'loungeA',
    weight: 1,
    drawFunction: function(ctx) {
      var cw = ctx.canvas.width;
      var ch = ctx.canvas.height;
      var bw = this.barWidth;
      var sh = (bw - (ch % bw)) * 0.5;
      var c = (ch / Math.max(2, bw)) + bw;
      var s = this.frametime % cw;
      var b, l, r, y;

      ctx.lineWidth = bw;
      ctx.lineCap = 'round';

      ctx.strokeStyle = this.colorA;
      for (b = 0; b < c; b += 2) {
        l = 0;
        r = s;
        y = (b * bw) - sh;
        ctx.beginPath();
        ctx.moveTo(l, y);
        ctx.lineTo(r, y);
        ctx.stroke();
      }

      ctx.strokeStyle = this.colorB;
      for (b = 1; b < c; b += 2) {
        l = cw - s;
        r = cw;
        y = (b * bw) - sh;
        ctx.beginPath();
        ctx.moveTo(l, y);
        ctx.lineTo(r, y);
        ctx.stroke();
      }
    },
    props: {
      barWidth: ['number', true, 50],
      colorA: ['string', true, 'rgb(234, 105, 41)'],
      colorB: ['string', true, 'rgb(236, 183, 156)'],
      beat: ['number', true, 100],
      lineWidth: ['number', true, 0]
    },
    mappings: [
      {
        eventNames: 'kp3:padX:change',
        targetProperty: 'lineWidth'
      },
      {
        eventNames: 'beat:a',
        targetProperty: 'beat'
      },
      {
        eventNames: 'color:a',
        targetProperty: 'colorA'
      },
      {
        eventNames: 'color:b',
        targetProperty: 'colorB'
      }
    ]
  },

  {
    name: 'loungeB',
    weight: 1,
    drawFunction: function(ctx) {
      var cw = ctx.canvas.width;
      var ch = ctx.canvas.height;
      var bw = this.barWidth;
      var sh = (bw - (ch % bw)) * 0.5;
      var c = (ch / Math.max(2, bw)) + bw;
      var s = this.frametime % cw;
      var b, l, r, y;

      ctx.lineWidth = bw;
      ctx.lineCap = 'round';

      ctx.strokeStyle = this.colorA;
      for (b = 0; b < c; b += 2) {
        l = 0;
        r = s;
        y = (b * bw) - sh;
        ctx.beginPath();
        ctx.moveTo(l, y);
        ctx.lineTo(r, y);
        ctx.stroke();
      }

      ctx.strokeStyle = this.colorB;
      for (b = 1; b < c; b += 2) {
        l = cw - s;
        r = cw;
        y = (b * bw) - sh;
        ctx.beginPath();
        ctx.moveTo(l, y);
        ctx.lineTo(r, y);
        ctx.stroke();
      }
    },
    props: {
      barWidth: ['number', true, 50],
      colorA: ['string', true, 'rgb(234, 105, 41)'],
      colorB: ['string', true, 'rgb(236, 183, 156)'],
      strokeColorA: ['string', true, 'rgb(234, 105, 41)'],
      strokeColorB: ['string', true, 'rgb(236, 183, 156)'],
      beat: ['number', true, 100],
      lineWidth: ['number', true, 0]
    },
    mappings: [
      {
        eventNames: 'kp3:padX:change',
        targetProperty: 'lineWidth'
      },
      {
        eventNames: 'beat:a',
        targetProperty: 'beat'
      },
      {
        eventNames: 'color:a',
        targetProperty: 'colorA'
      },
      {
        eventNames: 'color:b',
        targetProperty: 'colorB'
      },
      {
        eventNames: 'color:a',
        targetProperty: 'strokeColorA'
      },
      {
        eventNames: 'color:b',
        targetProperty: 'strokeColorB'
      }
    ]
  },

  {
    name: 'circles',
    active: false,
    weight: 2,
    drawFunction: function(ctx) {
      var _debug = this.collection.parent._debugNextUpdate;

      var bw = Math.max(1, this.barWidth);
      var ch = ctx.canvas.height * 0.5;
      var cw = ctx.canvas.width * 0.5;
      var fs = this.frames;
      var f = this.frame;
      var r = Math.sqrt(Math.pow(cw, 2) + Math.pow(ch, 2));
      var dbw = bw * 2;
      var _ca = Math.round((this.arbitraryA -50) / 10);
      var _cb = Math.round((this.arbitraryB -50) / 10);
      var d = this.direction;
      if (_debug) {
        console.info('layer state draw function (circles)', this, bw, cw, ch);
      }

      var a = (Math.PI * 2) / (fs / f);
      var af = -1 * d * a;
      var at = d * a;

      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = bw;

      var i;
      for (i = 0; i < r / dbw; i++) {
        ctx.beginPath();
        ctx.arc(cw, ch, (1 + i) * dbw, af + (Math.PI * (i % _ca) / _cb), at - (Math.PI * (i % _ca) / _cb));
        ctx.stroke();
        ctx.closePath();
      }
    },
    props: {
      barWidth: {
        type: 'number',
        required: true,
        default: 10
      },
      strokeStyle: {
        type: 'string',
        required: true,
        default: '#000'
      },
      lineCap: ['string', true, 'round'],
      arbitraryA: ['number', true, 10],
      arbitraryB: ['number', true, 10]
    }
  },

  {
    name: 'lines',
    active: true,
    weight: 5,
    drawFunction: function(ctx) {
      var h;
      var w;
      var vh;
      var vw;
      var cw = ctx.canvas.width;
      var ch = ctx.canvas.height;
      var hcw = cw * 0.5;
      var hch = ch * 0.5;
      var bw = Math.max(1, this.barWidth || 0);

      var _ca = 100 - this.arbitraryA;
      var _cb = 100 - this.arbitraryB;
      var dbw = bw * 2;
      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = bw;
      ctx.lineCap = this.lineCap;

      vh = (ch / 200) * _ca;
      for (w = (hcw - (Math.floor(hcw / dbw) * dbw)); w <= cw; w += dbw) {
        ctx.beginPath();
        ctx.moveTo(w, vh);
        ctx.lineTo(w, ch - vh);
        ctx.stroke();
        ctx.closePath();
      }

      vw = (cw / 200) * _cb;
      for (h = (hch - (Math.floor(hcw / dbw) * dbw)); h <= ch; h += dbw) {
        ctx.beginPath();
        ctx.moveTo(vw, h);
        ctx.lineTo(cw - vw, h);
        ctx.stroke();
        ctx.closePath();
      }
    },
    props: {
      barWidth: ['number', true, 50],
      strokeStyle: {
        type: 'string',
        required: true,
        default: '#fff'
      },
      lineCap: ['string', true, 'round'],
      arbitraryA: ['number', true, 10],
      arbitraryB: ['number', true, 10]
    },
    mappings: [
      {
        eventNames: 'beat:a',
        targetProperty: 'opacity'
      },
      {
        eventNames: 'color:a',
        targetProperty: 'strokeStyle'
      },
      {
        eventNames: 'color:a',
        targetProperty: 'strokeStyle'
      },
      {
        eventNames: 'mic:12',
        targetProperty: 'arbitraryA'
      },
      {
        eventNames: 'mic:15',
        targetProperty: 'arbitraryB'
      }
    ]
  },

  {
    name: 'soundbars',
    active: false,
    weight: 15,
    drawFunction: function(ctx) {
      var cw = ctx.canvas.width;
      var ch = ctx.canvas.height;
      var screenState = this.screenState;
      var mic = screenState.signals.mic;
      var keys = Object.keys(mic);
      var barWidth = (cw / keys.length);
      var barHeight;
      var x = 0;
      keys.forEach(function(key) {
        barHeight = mic[key];
        ctx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        ctx.fillRect(x, ch - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      });
    }
  }
];

window.VF._defaultSetup = {
  screenSignals: [
    {
      type: 'hslaSignal',
      defaultValue: '180,50%,50%,1',
      name: 'color:a',
      hue: 180,
      saturation: 100,
      lightness: 50,
      alpha: 100,
      mappings: [
        {
          targetProperty: 'hue',
          eventNames: 'effectSlider*3.6'
        },
        {
          targetProperty: 'saturation',
          eventNames: ''
        },
        {
          targetProperty: 'lightness',
          eventNames: ''
        },
        {
          targetProperty: 'alpha',
          eventNames: ''
        }
      ]
    },
    {
      type: 'hslaSignal',
      defaultValue: '190,50%,50%,1',
      name: 'color:b',
      hue: 180,
      saturation: 100,
      lightness: 50,
      alpha: 100,
      mappings: [
        {
          targetProperty: 'hue',
          eventNames: 'effectSlider*3.6'
        },
        {
          targetProperty: 'saturation',
          eventNames: ''
        },
        {
          targetProperty: 'lightness',
          eventNames: ''
        },
        {
          targetProperty: 'alpha',
          eventNames: ''
        }
      ]
    },
    // {
    //   type: 'rgbaSignal',
    //   defaultValue: '122,122,122,0.5',
    //   name: 'color:b',
    //   mappings: [
    //     {
    //       targetProperty: 'red',
    //       eventNames: ''
    //     },
    //     {
    //       targetProperty: 'green',
    //       eventNames: ''
    //     },
    //     {
    //       targetProperty: 'blue',
    //       eventNames: ''
    //     },
    //     {
    //       targetProperty: 'alpha',
    //       eventNames: ''
    //     }
    //   ]
    // },
    {
      type: 'beatSignal',
      name: 'beat:a',
      input: 125
    },
    {
      type: 'default',
      name: 'effectSlider*3.6',
      transformations: [
        {
          name: 'math.multiply',
          arguments: [3.6]
        }
      ],
      mappings: [
        {
          targetProperty: 'input',
          eventNames: 'kp3:effectSlider:change'
        }
      ]
    },
    {
      type: 'default',
      name: 'beat:a*3.6',
      transformations: [
        {
          name: 'math.multiply',
          arguments: [3.6]
        }
      ],
      mappings: [
        {
          targetProperty: 'input',
          eventNames: 'beat:a'
        }
      ]
    }
  ],


  screenLayers: [
    {
      type: 'img',
      name: 'Sky 1 back',
      active: false,
      src: './assets/sky1/sky1-back-grey.png'
    },
    {
      type: 'SVG',
      name: 'zeropaper',
      active: false,
      src: './assets/zeropaper-fat.svg'
    },
    {
      type: 'SVG',
      name: 'Visual Fiha',
      active: true,
      src: './assets/visual-fiha.svg'

    },
    {
      type: 'canvas',
      name: 'Canvas layer',
      active: true,
      canvasLayers: canvasLayers
    },
    {
      type: 'img',
      name: 'Sky 1 front',
      active: false,
      src: './assets/sky1/sky1-front-grey.png'
    }
  ]
};
