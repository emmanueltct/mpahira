export const LayoutToggle = ({ layout, setLayout }: any) => (
  <div className="flex gap-2">
    <button
      onClick={() => setLayout('grid')}
      className={layout === 'grid' ? 'font-bold underline' : ''}
    >
      Grid
    </button>
    <button
      onClick={() => setLayout('list')}
      className={layout === 'list' ? 'font-bold underline' : ''}
    >
      List
    </button>
  </div>
);
