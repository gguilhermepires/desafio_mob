interface Polyfills {
  init(): void;
}

const polyfills: Polyfills = {
  init: () => {
    if (!('toJSON' in Error.prototype)) {
      Object.defineProperty(Error.prototype, 'toJSON', {
        value: function () {
          const alt: Record<string, unknown> = {};

          Object.getOwnPropertyNames(this).forEach((key) => {
            if (process?.env?.NODE_ENV !== 'development' && key == 'stack') {
              return;
            }

            alt[key] = this[key];
          }, this);

          return alt;
        },
        configurable: true,
        writable: true,
      });
    }
  },
};

export default polyfills;
