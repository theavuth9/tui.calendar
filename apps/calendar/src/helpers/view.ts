import { DEFAULT_EVENT_PANEL, DEFAULT_TASK_PANEL } from '@src/constants/view';
import { limit, ratio } from '@src/utils/math';
import { getRelativeMousePosition, getX } from '@src/utils/mouse';

import { Options } from '@t/options';
import { Cells } from '@t/panel';

export function createMousePositionDataGrabberMonth(
  calendar: Cells[],
  grids: GridInfo[],
  container: HTMLElement
): (mouseEvent: MouseEvent) => MousePositionData | null {
  const weekCount = calendar.length;

  return function getGridPositionData(mouseEvent: MouseEvent) {
    const {
      left: containerLeft,
      top: containerTop,
      width,
      height,
    } = container.getBoundingClientRect();
    const [left, top] = getRelativeMousePosition(mouseEvent, {
      left: containerLeft,
      top: containerTop,
      clientLeft: container.clientLeft,
      clientTop: container.clientTop,
    });
    let gridX = getX(grids, ratio(width, 100, left));
    let gridY = Math.floor(ratio(height, weekCount, top));

    gridY = limit(gridY, [0], [calendar.length - 1]);

    const dateRange = calendar[gridY];

    if (!dateRange) {
      return null;
    }

    gridX = limit(gridX, [0], [dateRange.length - 1]);

    const date = dateRange[gridX];

    if (!date) {
      return null;
    }

    const { clientX, clientY } = mouseEvent;

    return {
      gridX,
      gridY,
      x: clientX,
      y: clientY,
      triggerEvent: mouseEvent.type,
    };
  };
}

export function createMousePositionDataGrabberWeek(
  cells: Cells,
  grids: GridInfo[],
  container: HTMLElement
): (mouseEvent: MouseEvent) => MousePositionData | null {
  return function getGridPositionData(mouseEvent: MouseEvent) {
    const { left: containerLeft, top: containerTop, width } = container.getBoundingClientRect();
    const [left] = getRelativeMousePosition(mouseEvent, {
      left: containerLeft,
      top: containerTop,
      clientLeft: container.clientLeft,
      clientTop: container.clientTop,
    });
    let gridX = getX(grids, ratio(width, 100, left));
    const gridY = 0;

    gridX = limit(gridX, [0], [cells.length - 1]);

    const date = cells[gridX];

    if (!date) {
      return null;
    }

    const { clientX, clientY } = mouseEvent;

    return {
      gridX,
      gridY,
      x: clientX,
      y: clientY,
      triggerEvent: mouseEvent.type,
    };
  };
}

export function getDisplayPanel(
  taskView: Required<Options>['taskView'],
  eventView: Required<Options>['eventView']
) {
  const displayPanel: string[] = [];

  if (taskView === true) {
    displayPanel.push(...DEFAULT_TASK_PANEL);
  } else if (Array.isArray(taskView)) {
    displayPanel.push(...taskView);
  }

  if (eventView === true) {
    displayPanel.push(...DEFAULT_EVENT_PANEL);
  } else if (Array.isArray(eventView)) {
    displayPanel.push(...eventView);
  }

  return displayPanel;
}
