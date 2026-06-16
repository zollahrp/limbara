"use client";

import Image from "next/image";
import Link from "next/link";


export default function Footer() {

  return (

    <footer className="bg-[#f8f7f3] border-t border-black/10">


      <div
        className="
        max-w-[1400px]
        mx-auto
        px-8
        lg:px-20
        py-16
        "
      >


        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-4
          gap-12
          "
        >



          {/* BRAND */}

          <div className="md:col-span-2">


            <Image

              src="/img/logo/limbara.png"

              alt="Limbara"

              width={250}

              height={80}

              className="
              object-contain
              w-auto
              h-12
              mb-6
              "

            />


            <p
            className="
            max-w-md
            text-gray-500
            leading-7
            text-sm
            "
            >

              Platform digital berbasis teknologi
              yang membantu mengenali, mengelola,
              dan mengoptimalkan potensi sampah
              untuk mendukung ekonomi sirkular.

            </p>


          </div>




          {/* MENU */}

          <div>


            <h4
            className="
            text-xs
            uppercase
            tracking-[0.3em]
            font-bold
            mb-6
            "
            >
              Menu
            </h4>


            <div className="space-y-4">


              {
                [
                  "Beranda",
                  "Scan Sampah",
                  "Bank Sampah"
                ].map(item=>(

                  <Link

                  href="#"

                  key={item}

                  className="
                  block
                  text-sm
                  text-gray-600
                  hover:text-green-700
                  transition
                  "

                  >

                  {item}

                  </Link>


                ))
              }


            </div>


          </div>





          {/* CONTACT */}

          <div>


            <h4
            className="
            text-xs
            uppercase
            tracking-[0.3em]
            font-bold
            mb-6
            "
            >

              Contact

            </h4>



            <div
            className="
            space-y-4
            text-sm
            text-gray-600
            "
            >

              <p>
                info@limbara.id
              </p>

              <p>
                Indonesia
              </p>

              <div className="flex gap-4 pt-2">

                <span className="
                w-8
                h-8
                rounded-full
                border
                border-black/20
                flex
                items-center
                justify-center
                text-xs
                ">
                  IG
                </span>


                <span className="
                w-8
                h-8
                rounded-full
                border
                border-black/20
                flex
                items-center
                justify-center
                text-xs
                ">
                  IN
                </span>


              </div>


            </div>


          </div>


        </div>





        {/* BOTTOM */}

        <div
        className="
        mt-14
        pt-6
        border-t
        border-black/10
        flex
        flex-col
        md:flex-row
        justify-between
        gap-4
        text-xs
        text-gray-400
        uppercase
        tracking-[0.25em]
        "
        >

          <p>
            © 2026 Limbara. All rights reserved.
          </p>


          <p>
            Sustainable Digital Innovation
          </p>


        </div>


      </div>


    </footer>

  );

}