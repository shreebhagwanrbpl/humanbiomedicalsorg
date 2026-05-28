"use client";

export default function AboutPage({
  district,
}) {

  const city = district
    ?.replace(/-/g, " ")
    ?.replace(
      /\b\w/g,
      (char) =>
        char.toUpperCase()
    );

  return (
    <main className="relative overflow-hidden">

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-violet-200/40 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-200/40 blur-3xl rounded-full"></div>

      {/* About Section */}
      <section className="pb-28 pt-24 relative z-10 overflow-hidden">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto">

            <span className="glass px-5 py-2 rounded-full text-sm font-medium text-slate-700 inline-block">
              About Human Biosis Pvt Ltd
              {city && ` in ${city}`}
            </span>

            <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Leading Laboratory & Hospital Equipment Company
              {city && ` in ${city}`}
            </h1>

            <p className="mt-8 text-lg sm:text-xl text-slate-600 leading-9">
              Human Biosis Pvt Ltd is a trusted healthcare equipment company
              specializing in premium laboratory instruments, hospital
              machines, diagnostic systems, pathology equipment,
              healthcare devices, and advanced medical technology solutions
              {city && ` in ${city}`}.
            </p>

          </div>

          {/* Main Grid */}
          <div className="mt-24 grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>

              <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                Delivering Advanced Healthcare Technology Solutions
                {city && ` in ${city}`}
              </h2>

              <p className="mt-8 text-lg text-slate-600 leading-9">
                We help hospitals, pathology laboratories, research centers,
                clinics, and healthcare institutions
                {city && ` in ${city}`} build reliable and
                modern medical infrastructure with premium healthcare
                equipment and advanced diagnostic systems.
              </p>

              <p className="mt-6 text-lg text-slate-600 leading-9">
                Our company focuses on delivering high-quality laboratory
                machines, hospital devices, diagnostic instruments,
                pathology systems, and medical equipment solutions
                designed for modern healthcare environments
                {city && ` in ${city}`}.
              </p>

              {/* Stats */}
              <div className="mt-14 grid grid-cols-2 gap-6">

                <div className="glass rounded-[28px] p-8">

                  <h3 className="text-4xl font-bold text-violet-600">
                    500+
                  </h3>

                  <p className="mt-3 text-slate-600">
                    Equipment Deliveries
                  </p>

                </div>

                <div className="glass rounded-[28px] p-8">

                  <h3 className="text-4xl font-bold text-violet-600">
                    100+
                  </h3>

                  <p className="mt-3 text-slate-600">
                    Hospitals Served
                  </p>

                </div>

              </div>

            </div>

            {/* Right Image */}
            <div className="relative">

              <div className="glass rounded-[40px] p-5 shadow-2xl">

                <img
                  src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1200&auto=format&fit=crop"
                  alt={`Laboratory and hospital equipment ${city ? `in ${city}` : ""}`}
                  className="w-full h-[600px] object-cover rounded-[30px]"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Mission & Vision */}
      <section className="pb-28 relative z-10">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-10">

            {/* Mission */}
            <div className="glass rounded-[32px] p-10 shadow-xl">

              <span className="px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold">
                Our Mission
              </span>

              <h2 className="mt-7 text-4xl font-bold text-slate-900">
                Delivering Advanced Healthcare Technology
                {city && ` in ${city}`}
              </h2>

              <p className="mt-6 text-slate-600 leading-9 text-lg">
                Human Biosis Pvt Ltd focuses on delivering premium laboratory
                instruments, hospital machines, diagnostic systems,
                pathology equipment, and healthcare technology solutions
                designed for modern healthcare institutions
                {city && ` in ${city}`}.
              </p>

              <p className="mt-6 text-slate-600 leading-9 text-lg">
                Our mission is to help hospitals, laboratories,
                diagnostic centers, and healthcare organizations
                {city && ` in ${city}`} build advanced medical
                infrastructure with reliable and high-performance
                medical equipment solutions.
              </p>

            </div>

            {/* Vision */}
            <div className="glass rounded-[32px] p-10 shadow-xl">

              <span className="px-4 py-2 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold">
                Our Vision
              </span>

              <h2 className="mt-7 text-4xl font-bold text-slate-900">
                Building Modern Medical Infrastructure
                {city && ` in ${city}`}
              </h2>

              <p className="mt-6 text-slate-600 leading-9 text-lg">
                We aim to become one of the most trusted healthcare
                equipment suppliers by providing advanced medical
                technology solutions and quality healthcare products
                {city && ` in ${city}`}.
              </p>

              <p className="mt-6 text-slate-600 leading-9 text-lg">
                Human Biosis Pvt Ltd continuously works towards innovation,
                customer satisfaction, and long-term healthcare partnerships
                across hospitals, pathology labs, and medical institutions
                {city && ` in ${city}`}.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Why Choose Us */}
      <section className="pb-28 relative z-10">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto">

            <span className="glass px-5 py-2 rounded-full text-sm font-medium text-slate-700 inline-block">
              Why Choose Us
              {city && ` in ${city}`}
            </span>

            <h2 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Trusted Healthcare Equipment Partner
              {city && ` in ${city}`}
            </h2>

            <p className="mt-8 text-lg sm:text-xl text-slate-600 leading-9">
              Human Biosis Pvt Ltd delivers reliable healthcare equipment
              solutions for hospitals, laboratories, research centers,
              clinics, and healthcare institutions
              {city && ` across ${city}`}.
            </p>

          </div>

          {/* Cards */}
          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Card */}
            <div className="glass rounded-[32px] p-8 shadow-xl hover:-translate-y-2 transition duration-300">

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center text-2xl font-bold">
                01
              </div>

              <h3 className="mt-8 text-2xl font-bold text-slate-900">
                Premium Product Quality
              </h3>

              <p className="mt-5 text-slate-600 leading-8">
                High-quality laboratory instruments, diagnostic systems,
                hospital devices, and healthcare technology solutions
                {city && ` in ${city}`}.
              </p>

            </div>

            {/* Card */}
            <div className="glass rounded-[32px] p-8 shadow-xl hover:-translate-y-2 transition duration-300">

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center text-2xl font-bold">
                02
              </div>

              <h3 className="mt-8 text-2xl font-bold text-slate-900">
                Modern Medical Technology
              </h3>

              <p className="mt-5 text-slate-600 leading-8">
                Advanced medical equipment and pathology systems
                designed for modern healthcare environments
                {city && ` in ${city}`}.
              </p>

            </div>

            {/* Card */}
            <div className="glass rounded-[32px] p-8 shadow-xl hover:-translate-y-2 transition duration-300">

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white flex items-center justify-center text-2xl font-bold">
                03
              </div>

              <h3 className="mt-8 text-2xl font-bold text-slate-900">
                Reliable Technical Support
              </h3>

              <p className="mt-5 text-slate-600 leading-8">
                Professional installation support, product guidance,
                and long-term customer service solutions
                {city && ` in ${city}`}.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Company Timeline */}
      <section className="pb-28 relative z-10">

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">

            <span className="glass px-5 py-2 rounded-full text-sm font-medium text-slate-700 inline-block">
              Company Journey
            </span>

            <h2 className="mt-8 text-4xl sm:text-5xl font-bold text-slate-900">
              Our Growth Timeline
              {city && ` in ${city}`}
            </h2>

          </div>

          {/* Timeline */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">

            <div className="glass rounded-[30px] p-8 shadow-xl">

              <h3 className="text-5xl font-bold text-violet-600">
                2018
              </h3>

              <h4 className="mt-6 text-2xl font-bold text-slate-900">
                Company Foundation
              </h4>

              <p className="mt-5 text-slate-600 leading-8">
                Human Biosis Pvt Ltd started with a vision to provide
                premium laboratory and hospital equipment solutions
                {city && ` in ${city}`}.
              </p>

            </div>

            <div className="glass rounded-[30px] p-8 shadow-xl">

              <h3 className="text-5xl font-bold text-violet-600">
                2022
              </h3>

              <h4 className="mt-6 text-2xl font-bold text-slate-900">
                Healthcare Expansion
              </h4>

              <p className="mt-5 text-slate-600 leading-8">
                Expanded medical equipment and diagnostic system
                supply services across multiple healthcare sectors
                {city && ` in ${city}`}.
              </p>

            </div>

            <div className="glass rounded-[30px] p-8 shadow-xl">

              <h3 className="text-5xl font-bold text-violet-600">
                2026
              </h3>

              <h4 className="mt-6 text-2xl font-bold text-slate-900">
                Trusted Medical Brand
              </h4>

              <p className="mt-5 text-slate-600 leading-8">
                Serving hospitals, laboratories, clinics, and
                healthcare institutions with premium medical solutions
                {city && ` in ${city}`}.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}