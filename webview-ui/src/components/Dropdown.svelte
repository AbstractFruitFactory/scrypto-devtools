<select>
  <slot />
</select>

<style>
  select {
    --background: #1e1e1e;
    --border-width: 1;
    --contrast-border: #6fc3df;
    --corner-radius: 0;
    --design-unit: 4;
    --disabled-opacity: 0.4;
    --focus-border: #007fd4;
    --font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif,
      Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
    --font-weight: 400;
    --foreground: #cccccc;
    --input-height: 26;
    --input-min-width: 100px;
    --type-ramp-base-font-size: 13px;
    --type-ramp-base-line-height: normal;
    --type-ramp-minus1-font-size: 11px;
    --type-ramp-minus1-line-height: 16px;
    --type-ramp-minus2-font-size: 9px;
    --type-ramp-minus2-line-height: 16px;
    --type-ramp-plus1-font-size: 16px;
    --type-ramp-plus1-line-height: 24px;
    --scrollbarWidth: 10px;
    --scrollbarHeight: 10px;
    --scrollbar-slider-background: #79797966;
    --scrollbar-slider-hover-background: #646464b3;
    --scrollbar-slider-active-background: #bfbfbf66;
    --badge-background: #4d4d4d;
    --badge-foreground: #ffffff;
    --button-border: transparent;
    --button-icon-background: transparent;
    --button-icon-corner-radius: 5px;
    --button-icon-outline-offset: 0;
    --button-icon-hover-background: rgba(90, 93, 94, 0.31);
    --button-icon-padding: 3px;
    --button-primary-background: #0e639c;
    --button-primary-foreground: #ffffff;
    --button-primary-hover-background: #1177bb;
    --button-secondary-background: #3a3d41;
    --button-secondary-foreground: #ffffff;
    --button-secondary-hover-background: #45494e;
    --button-padding-horizontal: 11px;
    --button-padding-vertical: 4px;
    --checkbox-background: #3c3c3c;
    --checkbox-border: #3c3c3c;
    --checkbox-corner-radius: 3;
    --checkbox-foreground: #f0f0f0;
    --list-active-selection-background: #094771;
    --list-active-selection-foreground: #ffffff;
    --list-hover-background: #2a2d2e;
    --divider-background: #454545;
    --dropdown-background: #3c3c3c;
    --dropdown-border: #3c3c3c;
    --dropdown-foreground: #f0f0f0;
    --dropdown-list-max-height: 200px;
    --input-background: #3c3c3c;
    --input-foreground: #cccccc;
    --input-placeholder-foreground: #cccccc;
    --link-active-foreground: #3794ff;
    --link-foreground: #3794ff;
    --progress-background: #0e70c0;
    --panel-tab-active-border: #e7e7e7;
    --panel-tab-active-foreground: #e7e7e7;
    --panel-tab-foreground: #e7e7e799;
    --panel-view-background: #1e1e1e;
    --panel-view-border: #80808059;
    --tag-corner-radius: 2px;
    --contrast-active-border: transparent;
    display: inline-flex;
    background: var(--dropdown-background);
    color: var(--foreground);
    font-family: var(--font-family);
    height: calc(var(--input-height) * 1px);
    position: relative;
    user-select: none;
    min-width: var(--input-min-width);
    outline: none;
    vertical-align: top;
    overflow-wrap: break-word;
    box-sizing: border-box;
    border: none;
  }

  select > option {
    --contrast-active-border: transparent;
    color: var(--foreground);
    font-family: var(--font-family);
    user-select: none;
    overflow-wrap: break-word;
    box-sizing: border-box;
  }
</style>
