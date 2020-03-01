import { FieldSubscription } from 'final-form';
import FieldArrayRenderProps from './FieldArrayRenderProps';
import RenderableProps from './RenderableProps';

interface FieldArrayProps extends RenderableProps<FieldArrayRenderProps> {
  name: string;
  isEqual?: (a: any, b: any) => boolean;
  subscription?: FieldSubscription;
  validate?: (value: any, allValues: object) => any;
}

export default FieldArrayProps;
