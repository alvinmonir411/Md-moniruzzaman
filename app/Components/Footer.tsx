import { Github, Linkedin, Mail, Phone, MapPin, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Alvin Monir
          </h2>
          <p className="mt-2 text-indigo-400 font-semibold">
            Front-End Developer
          </p>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            Crafting beautiful UIs, solving real problems, and building
            experiences that feel smoother than fresh butter on warm bread.
          </p>
        </div>

        {/* Middle: Contact */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-indigo-400" />
              +8801979915165
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-indigo-400" />
              alvinmonir411@gmail.com
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-indigo-400" />
              Dhaka, Bangladesh
            </li>
          </ul>
        </div>

        {/* Right: Links */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Find Me Online</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="https://alvin-monir-protfolio.vercel.app"
                className="flex items-center gap-3 hover:text-indigo-400 transition"
              >
                <Globe size={18} />
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="https://github.com/alvinmonir411"
                className="flex items-center gap-3 hover:text-indigo-400 transition"
              >
                <Github size={18} />
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/alvin-monir"
                className="flex items-center gap-3 hover:text-indigo-400 transition"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 mt-12 pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Alvin Monir — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
