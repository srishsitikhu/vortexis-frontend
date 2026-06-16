import React from "react";
import { CiMail } from "react-icons/ci";
import { IoCallOutline } from "react-icons/io5";

const ContactPage = () => {
  return (
    <div className="mx-25 p-10">
      <h1>
        Home / <b>Contact</b>
      </h1>
      <div className="flex gap-4">
        <div className="flex flex-col gap-5 border rounded-2xl border-neutral-200 p-8">
          <div className="flex items-center gap-4">
            <IoCallOutline
              size={45}
              className="bg-red-500 text-neutral-100 rounded-full p-2"
            />
            <h1 className="text-xl font-semibold">Call To US</h1>
          </div>
          <h1>We are available 24/7, 7 days a week</h1>
          <h1>Phone: +8801611112222</h1>
          <div className="flex justify-center mt-4 mb-4">
            <hr className="w-55" />
          </div>
          <div className="flex items-center gap-4">
            <CiMail
              size={45}
              className="bg-red-500 text-neutral-100 rounded-full p-2"
            />
            <h1 className="text-xl font-semibold">Write To US</h1>
          </div>
          <h1>
            Fill out out form and we will contact <br />
            you within 24 hours.
          </h1>
          <h1>Emails: customer@vortexis.com</h1>
          <h1>Emails: support@vortexis.com</h1>
        </div>
        <div className="flex flex-col gap-6 rounded-2xl border border-neutral-200 p-8">
          <div className="flex gap-4">
            <input
              className="bg-neutral-200 px-6 py-3 rounded-lg focus:outline-none focus:bg-neutral-100 w-full"
              type="text"
              placeholder="Your Name:* "
              required
            />
            <input
              className="bg-neutral-200 px-6 py-3 rounded-lg focus:outline-none focus:bg-neutral-100 w-full"
              type="text"
              placeholder="Your Email:*"
              required
            />
            <input
              className="bg-neutral-200 px-6 py-3 rounded-lg focus:outline-none focus:bg-neutral-100 w-full"
              type="text"
              placeholder="Your Phone:*"
              required
            />
          </div>
          <div>
            <textarea
              className="bg-neutral-200 px-6 py-3 rounded-lg focus:outline-none focus:bg-neutral-100"
              rows={10}
              cols={100}
              placeholder="Your Message"
            />
          </div>
          <div className="flex justify-end">
            <div>
              <button className="bg-red-500 text-neutral-100 px-4 py-2">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
