import CollectionView from './CollectionView';

export default function Users() {
  const endpointUrl = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    : '/api/users/';

  return (
    <CollectionView
      title="Users"
      endpointUrl={endpointUrl}
      emptyLabel="Nog geen gebruikers gevonden."
    />
  );
}
