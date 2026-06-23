import CollectionView from './CollectionView';

export default function Teams() {
  const endpointUrl = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : '/api/teams/';

  return (
    <CollectionView
      title="Teams"
      endpointUrl={endpointUrl}
      emptyLabel="Nog geen teams gevonden."
    />
  );
}
