module SharedParams
  extend Grape::API::Helpers

  params :question do
    requires :question, type: String, desc: "The contents of the question"
    requires :question_type,
             type: Symbol,
             values: %i[MULTI_SELECT MULTIPLE_CHOICE BINARY_CHOICE],
             desc:
               "The type of the quiz e.g MULTIPLE_CHOICE, SELECT, BINARY_CHOICE"

    requires :options, type: Array do
      requires :option, type: String, desc: "The contents of the option"
      requires :is_right,
               type: Boolean,
               desc: "Value indicating if the question is right or wrong"
    end
  end
end
