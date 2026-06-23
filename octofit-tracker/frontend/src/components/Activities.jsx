import CollectionView from './CollectionView';

export default function Activities() {
  return (
    <CollectionView
      title="Activities"
      endpointPath="/api/activities/"
      emptyLabel="Nog geen activiteiten gevonden."
    />
  );
}
