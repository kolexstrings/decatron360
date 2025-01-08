import PropertySearchForm from "./Properties/PropertySearchForm";

const Hero = () => {
  return (
    <section className="relative bg-primary-500 py-24 lg:py-32 text-white z-0">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-20 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        <div className="text-center mb-10">
          {/* Hook statement */}
          <h1
            className="text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight"
            style={{ fontFamily: "Nasaliation, sans-serif" }}
          >
            The easy way to buy real estate
          </h1>
        </div>

        {/* PropertySearchForm */}
        <div className="relative z-10 w-full max-w-3xl">
          <PropertySearchForm />
        </div>
      </div>
    </section>
  );
};

export default Hero;
