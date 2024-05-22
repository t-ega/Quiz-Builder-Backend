module SharedParams
  extend Grape::API::Helpers

  params :question do
    requires :text, type: String, desc: "The contents of the question"

    requires :type,
             type: Symbol,
             values: %i[MULTI_CHOICE SELECT SINGLE],
             desc: "The type of the quiz e.g MULTI-CHOICE, SELECT, SINGLE"

    requires :options, type: Array do
      requires :text, type: String, desc: "The contents of the option"
      requires :is_right,
               type: Boolean,
               desc: "Value indicating if the question is right or wrong"
    end
  end
end
