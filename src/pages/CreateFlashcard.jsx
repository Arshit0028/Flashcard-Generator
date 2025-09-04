import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { addFlashcard } from "../redux/flashcardSlice";
import { v4 as uuidv4 } from "uuid";
import { FiTrash2, FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// A reusable floating-label input field
const FormikField = ({ name, placeholder, as, ...props }) => (
  <div className="relative">
    <Field
      name={name}
      as={as}
      placeholder=" "
      className="block w-full px-4 py-3 text-sm text-gray-900 bg-white/40 backdrop-blur-md border border-gray-300/50 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-600 peer"
      {...props}
    />
    <label
      htmlFor={name}
      className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white/40 px-2 backdrop-blur-md peer-focus:text-purple-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
    >
      {placeholder}
    </label>
    <ErrorMessage name={name} />
  </div>
);

// Validation error message
const ErrorMessage = ({ name }) => (
  <Field name={name}>
    {({ form }) => {
      const error = form.errors[name] && form.touched[name] && form.errors[name];
      return error ? <div className="text-red-500 text-xs mt-1">{error}</div> : null;
    }}
  </Field>
);

export default function CreateFlashcard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const flashcards = useSelector((state) => state.flashcards.items);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("create");

  // Persist flashcards in localStorage
  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    terms: Yup.array()
      .of(
        Yup.object().shape({
          term: Yup.string().required("Term is required"),
          definition: Yup.string().required("Definition is required"),
        })
      )
      .min(1, "At least one term is required"),
  });

  return (
   <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 min-h-screen">
  {/* Top Navbar */}
  <div className="sticky top-0 z-50 backdrop-blur-md bg-white/60 shadow-sm">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      
      {/* Logo on Left */}
      <img
        src="data:image/png;base64,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"
        alt="logo"
        className="w-40 h-12 object-contain"
      />

      {/* Tabs Centered */}
      <div className="flex-1 flex justify-center">
        <div className="inline-flex bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl p-1 shadow-inner">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "create"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            ➕ Create
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "my"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            📂 My Flashcards
          </button>
        </div>
      </div>

    {/* Right Placeholder (optional) */}
    <div className="w-12" />
  </div>
</div>


    {/* Content */}
    <div className="container mx-auto p-6 md:p-10 lg:p-12">
        {activeTab === "create" && (
          <>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center text-slate-800 drop-shadow-lg">
              ✨ Create Your Flashcard Set
            </h1>

            <Formik
              initialValues={{
                title: "",
                description: "",
                image: "",
                terms: [{ term: "", definition: "", image: "" }],
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                const newFlashcard = {
                  id: uuidv4(),
                  ...values,
                };
                dispatch(addFlashcard(newFlashcard));
                setSubmitted(true);
                resetForm();
              }}
            >
              {({ values }) => (
                <Form className="space-y-10">
                  {/* Flashcard Info */}
                  <div className="bg-white/60 backdrop-blur-lg shadow-xl p-8 rounded-3xl border border-gray-200/40 hover:shadow-2xl transition">
                    <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-2">
                      📘 Set Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormikField name="title" placeholder="Flashcard Title" />
                      <FormikField name="image" placeholder="Cover Image URL (Optional)" />
                    </div>
                    <div className="mt-6">
                      <FormikField
                        name="description"
                        as="textarea"
                        rows="3"
                        placeholder="Short Description of the Set"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="bg-white/60 backdrop-blur-lg shadow-xl p-8 rounded-3xl border border-gray-200/40 hover:shadow-2xl transition">
                    <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-2">
                      📝 Add Terms
                    </h2>
                    <FieldArray name="terms">
                      {({ push, remove }) => (
                        <div className="space-y-6">
                          {values.terms.map((term, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-2xl border border-gray-200 relative shadow-inner"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-gray-600">
                                  TERM {index + 1}
                                </span>
                                {values.terms.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-500 hover:text-red-700 transition"
                                    title="Remove term"
                                  >
                                    <FiTrash2 size={20} />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormikField
                                  name={`terms[${index}].term`}
                                  placeholder="Term"
                                />
                                <FormikField
                                  name={`terms[${index}].definition`}
                                  placeholder="Definition"
                                />
                              </div>
                              <div className="mt-4">
                                <FormikField
                                  name={`terms[${index}].image`}
                                  placeholder="Image URL (Optional)"
                                />
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() =>
                              push({ term: "", definition: "", image: "" })
                            }
                            className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-transform hover:scale-105"
                          >
                            <FiPlusCircle className="mr-2" size={20} /> Add New Term
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-8 py-4 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transition-transform hover:scale-105"
                    >
                      ✅ Create Flashcard
                    </button>
                  </div>

                  {submitted && (
                    <div
                      className="p-4 rounded-xl text-green-800 bg-green-100/70 border border-green-200 shadow-md backdrop-blur-sm"
                      role="alert"
                    >
                      🎉 <strong>Success!</strong> Your flashcard set has been created.
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </>
        )}

        {/* My Flashcards */}
        {activeTab === "my" && (
          <>
            <h2 className="text-3xl font-bold mb-8 text-slate-800 text-center drop-shadow">
              📂 My Flashcards
            </h2>
            {flashcards.length === 0 ? (
              <div className="text-center text-gray-600">
                No flashcards yet. Create one ➕
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {flashcards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => navigate(`/flashcards/${card.id}`)}
                    className="relative bg-white/60 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-gray-200/50 cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    {card.image && (
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                    )}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {card.description}
                    </p>
                    <div className="flex items-center justify-between text-gray-500 text-xs mt-auto">
                      <span>
                        <span className="font-semibold">{card.terms.length}</span> terms
                      </span>
                      <span className="text-purple-600 font-medium">View →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
