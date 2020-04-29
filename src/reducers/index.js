import { combineReducers } from 'redux';
import ThemeOptions from './ThemeOptions';
import { authentication } from './authentication.reducer';
import { alert } from './alert.reducer';
const rootReducer = combineReducers({
  authentication,
  alert,
  ThemeOptions
});

export default rootReducer;