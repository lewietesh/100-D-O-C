const ProjectReviews = ({ reviews }: { reviews?: string[] }) =>
        reviews?.length ? (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-2">Client Reviews</h2>
            <ul className="space-y-2 text-gray-600 text-sm">
              {reviews.map((review, i) => (
                <li key={i} className="border border-gray-200 p-3 rounded bg-gray-50">
                  “{review}”
                </li>
              ))}
            </ul>
          </section>
        ) : null;
      
      export default ProjectReviews;
      