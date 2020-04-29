import React from "react";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useSelector } from "react-redux";

function LoadingProvider({ onToggleOpen, intl }) {
  const loadingStateProvider = useSelector(state => state.loadingProvider);
  const { isSubmittingStatusProvider } = loadingStateProvider;
  return isSubmittingStatusProvider ? (
    <LoadingIndicator />
  ) : null;
}
export default LoadingProvider;
