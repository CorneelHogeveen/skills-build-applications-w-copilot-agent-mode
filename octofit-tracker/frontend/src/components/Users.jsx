import CollectionView from './CollectionView';

export default function Users() {
  return (
    <CollectionView
      title="Users"
      endpointPath="/api/users/"
      emptyLabel="Nog geen gebruikers gevonden."
    />
  );
}
