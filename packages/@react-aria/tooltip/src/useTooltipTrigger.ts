import {AllHTMLAttributes, RefObject} from 'react';
import {chain} from '@react-aria/utils';
import {DOMProps} from '@react-types/shared';
import {TooltipState} from '@react-stately/tooltip';
import {useId} from '@react-aria/utils';
import {useOverlay} from '@react-aria/overlays';

interface TooltipProps extends DOMProps {
  onClose?: () => void,
  role?: 'tooltip'
}

interface TriggerProps extends DOMProps, AllHTMLAttributes<HTMLElement> {
  ref: RefObject<HTMLElement | null>,
}

interface TooltipTriggerProps {
  tooltipProps: TooltipProps,
  triggerProps: TriggerProps,
  state: TooltipState
}

interface TooltipTriggerAria {
  tooltipTriggerBaseProps: AllHTMLAttributes<HTMLElement>,
  tooltipAriaProps: AllHTMLAttributes<HTMLElement>,
  tooltipInteractionProps: AllHTMLAttributes<HTMLElement>
}

export function useTooltipTrigger(props: TooltipTriggerProps): TooltipTriggerAria {
  let {
    tooltipProps,
    triggerProps,
    state
  } = props;

  let tooltipTriggerId = useId();

  let {overlayProps} = useOverlay({
    ref: triggerProps.ref,
    onClose: tooltipProps.onClose,
    isOpen: state.open
  });

  let onKeyDownTrigger = (e) => {
    if (triggerProps.ref && triggerProps.ref.current) {
      // dismiss tooltip on esc key press
      if (e.key === 'Escape' || e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        state.setOpen(false);
      }
    }
  };

  return {
    tooltipTriggerBaseProps: {
      ...overlayProps,
      id: tooltipTriggerId,
      role: 'button'
    },
    tooltipAriaProps: {
      'aria-describedby': tooltipProps['aria-describedby'] || tooltipTriggerId,
      role: tooltipProps.role || 'tooltip'
    },
    tooltipInteractionProps: {
      onKeyDown: chain(triggerProps.onKeyDown, onKeyDownTrigger)
    }
  };
}