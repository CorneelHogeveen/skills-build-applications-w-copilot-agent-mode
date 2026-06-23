import CollectionView from './CollectionView';

export default function Workouts() {
  const endpointUrl = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : '/api/workouts/';

  return (
    <CollectionView
      title="Workouts"
      endpointUrl={endpointUrl}
      emptyLabel="Nog geen workout-suggesties gevonden."
    />
  );
}
