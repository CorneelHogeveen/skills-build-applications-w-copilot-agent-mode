import CollectionView from './CollectionView';

export default function Activities() {
  const endpointUrl = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : '/api/activities/';

  return (
    <CollectionView
      title="Activities"
      endpointUrl={endpointUrl}
      emptyLabel="Nog geen activiteiten gevonden."
    />
  );
}
